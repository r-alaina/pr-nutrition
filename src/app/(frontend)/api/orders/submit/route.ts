import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import type { PayloadRequest } from 'payload'
import config from '@/payload.config'
import { calculateAllergenCharges } from '@/utilities/allergenCharges'
import type { Tier, MenuItem, Order } from '@/payload-types'

interface CartItem {
  meal: MenuItem
  quantity: number
  weekHalf?: string
}

interface SubmitOrderRequest {
  selectedMeals: CartItem[]
}

export async function POST(request: NextRequest) {
  try {
    console.log('Order submit API called')

    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    console.log('Token found:', !!token)

    if (!token) {
      console.log('No token found, returning 401')
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    console.log('Payload initialized')

    // Get the current user
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `payload-token=${token}` }),
    })

    console.log('User found:', !!user)

    if (!user) {
      console.log('No user found, returning 401')
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    if (user.collection !== 'customers') {
      console.log('User is not a customer, returning 403')
      return NextResponse.json({ message: 'Only customers can place orders' }, { status: 403 })
    }

    const body = (await request.json()) as SubmitOrderRequest
    console.log('Request body received:', { selectedMealsCount: body.selectedMeals?.length })

    const { selectedMeals } = body

    if (!selectedMeals || !Array.isArray(selectedMeals) || selectedMeals.length === 0) {
      console.log('No meals selected, returning 400')
      return NextResponse.json({ message: 'No meals selected' }, { status: 400 })
    }

    // Determine the "Week Of" date (Closest Sunday)
    // For now, assuming current date is within the order window for the "upcoming" week.
    // In a real scenario, this might need more robust logic based on cutoff times.
    const today = new Date()
    const currentDay = today.getDay()
    const daysToLastSunday = currentDay === 0 ? 0 : currentDay
    const weekOfDate = new Date(today)
    weekOfDate.setDate(today.getDate() - daysToLastSunday)
    weekOfDate.setHours(0, 0, 0, 0)

    // Check for existing order
    const existingOrders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { customer: { equals: user.id } },
          { weekOf: { equals: weekOfDate.toISOString() } },
          { status: { not_equals: 'cancelled' } }
        ]
      }
    })

    const existingOrder = existingOrders.totalDocs > 0 ? existingOrders.docs[0] : null
    const isUpdate = !!existingOrder

    // Generate order number (reuse if updating)
    const orderNumber = existingOrder ? existingOrder.orderNumber : `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    // Separate snacks from meals
    const meals = selectedMeals.filter((item) => item.meal.category !== 'snack')
    const snacks = selectedMeals.filter((item) => item.meal.category === 'snack')

    // Calculate allergen charges for all items (meals + snacks)
    const userAllergies = user.allergies || []
    const { allergenCharges, totalAllergenCharges } = calculateAllergenCharges(
      selectedMeals,
      userAllergies,
    )

    // Calculate totals based on user's tier and subscription frequency
    const tier = typeof user.tier === 'object' && user.tier !== null ? (user.tier as Tier) : null
    const subscriptionFrequency = user.subscription_frequency
    // Logic: If monthly, we treat it as "weekly" for price calculation purposes, but handle payment differently
    // Effectively, we calculate the "Value" of the order first.

    const isMonthlyPlan = subscriptionFrequency === 'monthly'

    // Determine week_half from selected meals - if meals from both halves, store as combined
    // Otherwise, use the week_half from the meals
    const mealWeeks = new Set(
      selectedMeals.map((item) => item.weekHalf || 'firstHalf'),
    )
    const weekHalf =
      mealWeeks.size > 1 ? 'both' : mealWeeks.has('secondHalf') ? 'secondHalf' : 'firstHalf'

    let mealSubtotal = 0
    let snackSubtotal = 0
    let isCreditUsed = false
    let creditsToDeduct = 0

    // Determine Pricing
    if (tier && meals.length > 0) {
      // 1. Get user configuration
      const daysPerWeek = parseInt(user.days_per_week || '5')
      const mealsPerDay = parseInt(user.meals_per_day || '2') // Default to 2 if not set
      const includeBreakfast = user.include_breakfast || false

      // 2. Determine Breakfast Price based on Tier
      const lowerBreakfastTiers = ['Tier 1', 'Tier 1+', 'Tier 2']
      const breakfastPrice = lowerBreakfastTiers.includes(tier.tier_name) ? 6.50 : 8.00

      // 3. Calculate Base Weekly Cost
      const weeklyMealCost = daysPerWeek * mealsPerDay * tier.single_price
      const weeklyBreakfastCost = includeBreakfast ? (daysPerWeek * breakfastPrice) : 0
      const totalBaseWeekly = weeklyMealCost + weeklyBreakfastCost

      // 4. Calculate Final Meal Price
      if (isUpdate) {
        // If updating, we keep the original payment method/amount for the base plan
        // BUT, if it was credit, it remains credit. If it was cash, it remains cash.
        // Complex logic: For now, if updating, we assume the base plan is already "paid" or committed.
        // We only recalculate potential add-ons or re-validate.
        // Simpler approach: Re-calculate everything. existingOrder.isCreditUsed determines if we charge $0.
        isCreditUsed = existingOrder.isCreditUsed || false

        if (isCreditUsed) {
          mealSubtotal = 0 // Already paid via credit
        } else {
          // Re-charge? Or diff?
          // Since we don't handle real payments yet, we just calculate the owed amount.
          // If monthly without credit, it's the full monthly price.
          // If weekly, it's the weekly price.
          // HOWEVER, if updating, we shouldn't double charge.
          // Let's assume for this refactor that "Payment" is handled externally or logic is straightforward.

          // If weekly plan:
          if (!isMonthlyPlan) {
            mealSubtotal = totalBaseWeekly * 0.90 // 10% discount
          }
        }
      } else {
        // New Order
        if (isMonthlyPlan) {
          const currentCredits = user.plan_credits || 0
          if (currentCredits > 0) {
            // Use Credit
            isCreditUsed = true
            mealSubtotal = 0
            creditsToDeduct = 1
          } else {
            // Charge Full Monthly Price (4 weeks)
            // 15% Discount
            mealSubtotal = (totalBaseWeekly * 4) * 0.85
            // Grant 3 credits (for future weeks) - user gets 1 week "now" + 3 credits
          }
        } else {
          // Weekly Plan
          mealSubtotal = totalBaseWeekly * 0.90 // 10% discount
        }
      }
    }

    // Snacks are always a la carte
    snacks.forEach((item) => {
      const unitPrice = item.meal.price || 0
      snackSubtotal += unitPrice * item.quantity
    })

    const subtotal = mealSubtotal + snackSubtotal

    // Create order items for display purposes
    const orderItems = selectedMeals.map(
      (item) => {
        const isSnack = item.meal.category === 'snack'
        const itemWeekHalf = item.weekHalf || 'firstHalf'

        // Snacks always use individual pricing
        if (isSnack) {
          const unitPrice = item.meal.price || 0
          const totalPrice = unitPrice * item.quantity
          return {
            menuItem: {
              id: item.meal.id,
              name: item.meal.name,
              description: item.meal.description,
              category: item.meal.category as string,
            },
            quantity: item.quantity,
            weekHalf: itemWeekHalf,
            unitPrice: Math.round(unitPrice * 100) / 100,
            totalPrice: Math.round(totalPrice * 100) / 100,
          }
        }

        // Meal pricing for display
        // If credit used or part of monthly bundle, unit price effectively 0 for this specific order item display
        // to avoid confusion, or show "avg price".
        // Let's keep it simple: specific order items have 0 price if covered by plan subtotal?
        // Or distribute subtotal.
        // Distributed logic from before:
        let unitPrice = 0
        if (tier && meals.length > 0) {
          // Only calculate unit price if there is a subtotal to distribute
          if (mealSubtotal > 0) {
            // ... distribution logic ... using simple division for now
            unitPrice = mealSubtotal / meals.length
          }
        }

        const totalPrice = unitPrice * item.quantity

        return {
          menuItem: {
            id: item.meal.id,
            name: item.meal.name,
            description: item.meal.description,
            category: item.meal.category as string,
          },
          quantity: item.quantity,
          weekHalf: itemWeekHalf,
          unitPrice: Math.round(unitPrice * 100) / 100,
          totalPrice: Math.round(totalPrice * 100) / 100,
        }
      },
    )

    // Calculate tax (8.25%) on subtotal + allergen charges
    const taxRate = 0.0825
    const subtotalWithAllergens = subtotal + totalAllergenCharges
    const taxAmount = subtotalWithAllergens * taxRate
    const totalAmount = subtotalWithAllergens + taxAmount

    const orderResponse = {
      id: existingOrder ? existingOrder.id : `order-${orderNumber}`,
      orderNumber,
      status: 'pending',
      orderItems,
      allergenCharges,
      totalAllergenCharges,
      subtotal: Math.round(subtotal * 100) / 100,
      subtotalWithAllergens: Math.round(subtotalWithAllergens * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      createdAt: new Date().toISOString(),
      isCreditUsed,
    }

    // DB Operations
    let savedOrder;

    if (isUpdate) {
      // Log changes
      await payload.create({
        collection: 'order-logs',
        data: {
          order: existingOrder.id,
          customer: user.id,
          changeDescription: `Order updated by customer. Previous total: ${existingOrder.totalAmount}, New total: ${totalAmount}`,
          previousItems: existingOrder.orderItems,
          newItems: orderItems.map(item => ({ id: item.menuItem.id, quantity: item.quantity })),
        }
      })

      // Update Order
      savedOrder = await payload.update({
        collection: 'orders',
        id: existingOrder.id,
        data: {
          orderItems: orderItems.map((item) => ({
            menuItem: item.menuItem.id,
            quantity: item.quantity,
            weekHalf: item.weekHalf as 'firstHalf' | 'secondHalf',
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          allergenCharges,
          totalAllergenCharges,
          subtotal: orderResponse.subtotal,
          taxAmount: orderResponse.taxAmount,
          totalAmount: orderResponse.totalAmount,
          weekHalf: weekHalf,
          notes: `Order updated by ${user.firstName} ${user.lastName}`,
        }
      })

    } else {
      // Create New Order
      // Prepare data
      const reqObj = {
        user,
        payload,
      }

      savedOrder = await payload.create({
        collection: 'orders',
        data: {
          orderNumber,
          customer: user.id,
          status: 'pending',
          weekOf: weekOfDate.toISOString(),
          isCreditUsed,
          orderItems: orderItems.map((item) => ({
            menuItem: item.menuItem.id,
            quantity: item.quantity,
            weekHalf: item.weekHalf as 'firstHalf' | 'secondHalf',
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          allergenCharges,
          totalAllergenCharges,
          subtotal: orderResponse.subtotal,
          taxAmount: orderResponse.taxAmount,
          totalAmount: orderResponse.totalAmount,
          tier: tier?.id || null,
          subscriptionFrequency: (subscriptionFrequency as 'weekly' | 'monthly' | 'a_la_carte') || null,
          mealsPerWeek: user.meals_per_week || null,
          weekHalf: weekHalf,
          notes: `Order placed by ${user.firstName} ${user.lastName}`,
        },
        req: reqObj as unknown as PayloadRequest,
      })

      // Handle Credits
      if (creditsToDeduct > 0) {
        await payload.update({
          collection: 'customers',
          id: user.id,
          data: {
            plan_credits: (user.plan_credits || 0) - creditsToDeduct
          }
        })
      } else if (isMonthlyPlan && !isCreditUsed) {
        // Purchases a new plan block
        await payload.update({
          collection: 'customers',
          id: user.id,
          data: {
            plan_credits: 3 // Set to 3 for future use
          }
        })
      }
    }

    const orderResult = savedOrder as Order

    console.log('Order saved/updated:', orderResult.id)

    // Return success with order data
    return NextResponse.json({
      message: isUpdate ? 'Order updated successfully' : 'Order submitted successfully',
      order: {
        ...orderResponse,
        id: orderResult.id,
        orderNumber: orderResult.orderNumber || orderNumber,
      },
    })
  } catch (error) {
    console.error('Error submitting order:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Full error details:', error)
    return NextResponse.json(
      { message: 'Failed to submit order', error: errorMessage },
      { status: 500 },
    )
  }
}
