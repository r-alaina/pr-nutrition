import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import type { PayloadRequest } from 'payload'
import config from '@/payload.config'
import { calculateAllergenCharges } from '@/utilities/allergenCharges'
import type { Tier, MenuItem } from '@/payload-types'

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

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

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

    // Determine week_half from selected meals - if meals from both halves, store as combined
    // Otherwise, use the week_half from the meals
    const mealWeeks = new Set(
      selectedMeals.map((item) => item.weekHalf || 'firstHalf'),
    )
    const weekHalf =
      mealWeeks.size > 1 ? 'both' : mealWeeks.has('secondHalf') ? 'secondHalf' : 'firstHalf'

    let mealSubtotal = 0
    let snackSubtotal = 0

    // Calculate meal pricing (tier-based or a la carte)
    if (tier && subscriptionFrequency && meals.length > 0) {
      // Logic for new dynamic pricing
      // 1. Get user configuration
      const daysPerWeek = parseInt(user.days_per_week || '5')
      const mealsPerDay = parseInt(user.meals_per_day || '2') // Default to 2 if not set
      const includeBreakfast = user.include_breakfast || false

      // 2. Determine Breakfast Price based on Tier
      // Lower tiers: Tier 1, Tier 1+, Tier 2 -> $6.50
      // Higher tiers: Tier 2+, Tier 3, Tier 3+ -> $8.00
      const lowerBreakfastTiers = ['Tier 1', 'Tier 1+', 'Tier 2']
      const breakfastPrice = lowerBreakfastTiers.includes(tier.tier_name) ? 6.50 : 8.00

      // 3. Calculate Base Weekly Cost
      const weeklyMealCost = daysPerWeek * mealsPerDay * tier.single_price
      const weeklyBreakfastCost = includeBreakfast ? (daysPerWeek * breakfastPrice) : 0
      const totalBaseWeekly = weeklyMealCost + weeklyBreakfastCost

      // 4. Apply Frequency Discount
      if (subscriptionFrequency === 'weekly') {
         // 10% Discount
         mealSubtotal = totalBaseWeekly * 0.90
      } else if (subscriptionFrequency === 'monthly') {
         // 15% Discount (x4 weeks)
         mealSubtotal = (totalBaseWeekly * 4) * 0.85
      } else {
         // Fallback to weekly
         mealSubtotal = totalBaseWeekly * 0.90
      }
    }
    // Meals are not available a la carte - require tier subscription

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
            },
            quantity: item.quantity,
            weekHalf: itemWeekHalf,
            unitPrice: Math.round(unitPrice * 100) / 100,
            totalPrice: Math.round(totalPrice * 100) / 100,
          }
        }

        // Meals are priced by tier subscription, not individually
        // Calculate a per-meal price based on the tier pricing for order tracking
        let unitPrice = 0
        if (tier && subscriptionFrequency) {
           // Re-calculate the effective unit price based on the subtotal
           // Total Subtotal / Total Meal Count
           const daysPerWeek = parseInt(user.days_per_week || '5')
           const mealsPerDay = parseInt(user.meals_per_day || '2')
           const includeBreakfast = user.include_breakfast || false
           
           const mealsPerWeek = daysPerWeek * (mealsPerDay + (includeBreakfast ? 1 : 0))
           const totalMeals = subscriptionFrequency === 'monthly' ? mealsPerWeek * 4 : mealsPerWeek
           
           if (totalMeals > 0) {
             unitPrice = mealSubtotal / totalMeals
           }
        }
        // Meals are not available a la carte - require tier subscription

        const totalPrice = unitPrice * item.quantity

        return {
          menuItem: {
            id: item.meal.id,
            name: item.meal.name,
            description: item.meal.description,
          },
          quantity: item.quantity,
          weekHalf: itemWeekHalf,
          unitPrice: Math.round(unitPrice * 100) / 100, // Round to 2 decimal places
          totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
        }
      },
    )

    // Calculate tax (8.25%) on subtotal + allergen charges
    const taxRate = 0.0825
    const subtotalWithAllergens = subtotal + totalAllergenCharges
    const taxAmount = subtotalWithAllergens * taxRate
    const totalAmount = subtotalWithAllergens + taxAmount

    // For now, just return the order data without saving to database
    // This avoids any database migration issues
    const orderResponse = {
      id: `order-${orderNumber}`,
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
    }

    // Save the order to the database
    // Create a proper req object for Payload with user and payload context
    // We cast to any for 'req' because strict typing for generic PayloadRequest is complex in this context
    // and Payload's local API create method expects a specific Request definition.
    // However, we can improve this by using Partial<PayloadRequest>.
    const reqObj = {
      user,
      payload,
    }

    const savedOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: user.id,
        status: 'pending',
        orderItems: orderItems.map((item) => ({
          menuItem: item.menuItem.id,
          quantity: item.quantity,
          weekHalf:
            item.weekHalf === 'firstHalf' || item.weekHalf === 'secondHalf'
              ? item.weekHalf
              : 'firstHalf',
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

    console.log('Order saved to database:', savedOrder.id)
    console.log('Kitchen order should be created automatically via afterChange hook')

    // Return success with order data
    return NextResponse.json({
      message: 'Order submitted successfully',
      order: {
        ...orderResponse,
        id: savedOrder.id,
        orderNumber: savedOrder.orderNumber || orderNumber,
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
