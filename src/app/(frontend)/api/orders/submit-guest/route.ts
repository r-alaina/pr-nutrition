import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { calculateAllergenCharges } from '@/utilities/allergenCharges'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    console.log('Guest order submit API called')

    const payload = await getPayload({ config })
    console.log('Payload initialized')

    const body = await request.json()
    console.log('Request body received:', {
      customerInfo: !!body.customerInfo,
      tier: !!body.tier,
      selectedMealsCount: body.selectedMeals?.length,
    })

    const { customerInfo, tier, selectedMeals } = body

    if (
      !customerInfo ||
      !tier ||
      !selectedMeals ||
      !Array.isArray(selectedMeals) ||
      selectedMeals.length === 0
    ) {
      console.log('Missing required data, returning 400')
      return NextResponse.json(
        { message: 'Missing required information (customer info, tier, or meals)' },
        { status: 400 },
      )
    }

    // Validate required customer fields
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      return NextResponse.json({ message: 'First name, last name, email, and phone are required' }, { status: 400 })
    }

    // Check if customer already exists
    let customer
    const existingCustomer = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: customerInfo.email,
        },
      },
      limit: 1,
    })

    if (existingCustomer.totalDocs > 0) {
      // Customer exists, use existing customer
      customer = existingCustomer.docs[0]
      console.log('Using existing customer:', customer.id)

      // Update customer with new tier and preferences if needed
      if (tier?.id) {
        const customerAllergies = Array.isArray(customerInfo.allergies)
          ? customerInfo.allergies
          : customerInfo.allergies
            ? customerInfo.allergies
                .split(',')
                .map((a: string) => a.trim())
                .filter(Boolean)
            : []

        await payload.update({
          collection: 'customers',
          id: typeof customer.id === 'number' ? customer.id : parseInt(String(customer.id), 10),
          data: {
            tier: tier.id,
            allergies: customerAllergies,
            subscription_frequency: 'weekly', // Default for guest orders
            meals_per_week: 20, // Default for guests
            preferences_set: true,
          },
        })
      }
    } else {
      // Create new customer account with generated password
      // Generate a random password (customer can reset via email later)
      const randomPassword = crypto.randomBytes(16).toString('hex')

      const customerAllergies = Array.isArray(customerInfo.allergies)
        ? customerInfo.allergies
        : customerInfo.allergies
          ? customerInfo.allergies
              .split(',')
              .map((a: string) => a.trim())
              .filter(Boolean)
          : []

      customer = await payload.create({
        collection: 'customers',
        data: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          password: randomPassword,
          tier: tier?.id || null,
          allergies: customerAllergies,
          subscription_frequency: 'weekly',
          meals_per_week: 20,
          preferences_set: true,
        },
      })

      console.log('Customer created:', customer.id)
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    // Transform selected meals to match expected format
    const formattedMeals = selectedMeals.map((item: any) => {
      // If meal is nested (from sessionStorage)
      if (item.meal) {
        const mealId =
          typeof item.meal.id === 'number' ? item.meal.id : parseInt(String(item.meal.id), 10)

        return {
          meal: {
            id: mealId,
            name: item.meal.name,
            category: item.meal.category,
            allergens: item.meal.allergens || [],
            price: item.meal.price || 0,
            description: item.meal.description || '',
          },
          quantity: item.quantity,
          weekHalf: item.weekHalf || 'firstHalf',
        }
      }
      // If meal is flat (legacy format)
      const mealId = typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10)

      return {
        meal: {
          id: mealId,
          name: item.name,
          category: item.category,
          allergens: item.allergens || [],
          price: item.price || 0,
          description: item.description || '',
        },
        quantity: item.quantity,
        weekHalf: item.weekHalf || 'firstHalf',
      }
    })

    // Separate snacks from meals
    const meals = formattedMeals.filter((item: { meal: any }) => item.meal.category !== 'snack')
    const snacks = formattedMeals.filter((item: { meal: any }) => item.meal.category === 'snack')

    // Calculate allergen charges
    const customerAllergies = Array.isArray(customerInfo.allergies)
      ? customerInfo.allergies
      : customerInfo.allergies
        ? customerInfo.allergies
            .split(',')
            .map((a: string) => a.trim())
            .filter(Boolean)
        : []

    // Allergen charge is $5 per order if customer has any allergies (regardless of meal conflicts)
    const totalAllergenCharges = customerAllergies.length > 0 ? 5.0 : 0

    // Calculate allergen charges breakdown for reporting
    const { allergenCharges } = calculateAllergenCharges(formattedMeals, customerAllergies)

    // Determine week_half from selected meals
    const mealWeeks = new Set(
      formattedMeals.map((item: { weekHalf?: string }) => item.weekHalf || 'firstHalf'),
    )
    const weekHalf =
      mealWeeks.size > 1 ? 'both' : mealWeeks.has('secondHalf') ? 'secondHalf' : 'firstHalf'

    // Calculate subtotal
    const tierPrice = tier?.weekly_price || 0
    let snackSubtotal = 0
    snacks.forEach((item: { meal: any; quantity: number }) => {
      const unitPrice = item.meal.price || 0
      snackSubtotal += unitPrice * item.quantity
    })
    const subtotal = tierPrice + snackSubtotal

    // Create order items
    const orderItems = formattedMeals.map(
      (item: { meal: any; quantity: number; weekHalf?: string }) => {
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
              description: item.meal.description || '',
            },
            quantity: item.quantity,
            weekHalf: itemWeekHalf,
            unitPrice: Math.round(unitPrice * 100) / 100,
            totalPrice: Math.round(totalPrice * 100) / 100,
          }
        }

        // Meals use tier pricing (distributed evenly)
        const unitPrice = tierPrice / Math.max(1, meals.length)
        const totalPrice = unitPrice * item.quantity
        return {
          menuItem: {
            id: item.meal.id,
            name: item.meal.name,
            description: item.meal.description || '',
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

    // Create order response
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
    const reqObj = {
      user: customer,
      payload,
    } as any

    console.log('Creating order with data:', {
      orderNumber,
      customerId: typeof customer.id === 'number' ? customer.id : parseInt(String(customer.id), 10),
      orderItemsCount: orderItems.length,
      tierId: tier?.id,
      totalAmount: orderResponse.totalAmount,
    })

    const savedOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: typeof customer.id === 'number' ? customer.id : parseInt(String(customer.id), 10),
        status: 'pending',
        orderItems: orderItems.map((item) => ({
          menuItem:
            typeof item.menuItem.id === 'number'
              ? item.menuItem.id
              : parseInt(String(item.menuItem.id), 10),
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
        tier: tier?.id
          ? typeof tier.id === 'number'
            ? tier.id
            : parseInt(String(tier.id), 10)
          : null,
        subscriptionFrequency: 'weekly',
        mealsPerWeek: 20,
        weekHalf: weekHalf,
        notes: `Guest order placed by ${customerInfo.name} (${customerInfo.email}). Phone: ${customerInfo.phone}`,
      },
      req: reqObj,
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
        weekHalf: weekHalf,
      },
    })
  } catch (error) {
    console.error('Error submitting guest order:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Full error details:', error)

    // Log more details if it's a Payload error
    if (error && typeof error === 'object' && 'data' in error) {
      console.error('Payload error data:', (error as any).data)
    }
    if (error && typeof error === 'object' && 'errors' in error) {
      console.error('Payload validation errors:', (error as any).errors)
    }

    return NextResponse.json(
      {
        message: 'Failed to submit order',
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 },
    )
  }
}
