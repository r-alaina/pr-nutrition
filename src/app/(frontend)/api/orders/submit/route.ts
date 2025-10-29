import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { calculateAllergenCharges } from '@/utilities/allergenCharges'

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

    const body = await request.json()
    console.log('Request body received:', { selectedMealsCount: body.selectedMeals?.length })

    const { selectedMeals } = body

    if (!selectedMeals || !Array.isArray(selectedMeals) || selectedMeals.length === 0) {
      console.log('No meals selected, returning 400')
      return NextResponse.json({ message: 'No meals selected' }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    // Calculate allergen charges
    const userAllergies = (user as any).allergies || []
    const { allergenCharges, totalAllergenCharges } = calculateAllergenCharges(selectedMeals, userAllergies)

    // Calculate totals based on user's tier and subscription frequency
    const tier = (user as any).tier
    const subscriptionFrequency = (user as any).subscription_frequency

    let subtotal = 0
    let tierPrice = 0

    if (tier && subscriptionFrequency) {
      // Get the tier pricing based on subscription frequency
      if (subscriptionFrequency === 'weekly') {
        tierPrice = tier.weekly_price || 0
      } else if (subscriptionFrequency === 'monthly') {
        tierPrice = tier.monthly_price || 0
      } else {
        // Fallback to weekly pricing
        tierPrice = tier.weekly_price || 0
      }
      subtotal = tierPrice
    } else {
      // Fallback: calculate based on individual meal prices (a la carte)
      selectedMeals.forEach((item: { meal: any; quantity: number }) => {
        const unitPrice = item.meal.price || 0
        subtotal += unitPrice * item.quantity
      })
    }

    // Create order items for display purposes
    const orderItems = selectedMeals.map((item: { meal: any; quantity: number }) => {
      // For tier-based pricing, calculate a per-meal price based on the tier pricing
      // This helps admins understand the value of each meal in the subscription
      let unitPrice = 0
      if (tier && subscriptionFrequency) {
        const totalMealsPerWeek = (user as any).meals_per_week || 10
        if (subscriptionFrequency === 'weekly') {
          unitPrice = (tier.weekly_price || 0) / totalMealsPerWeek
        } else if (subscriptionFrequency === 'monthly') {
          // For monthly, calculate weekly equivalent then divide by meals per week
          const weeklyEquivalent = (tier.monthly_price || 0) / 4 // Approximate 4 weeks per month
          unitPrice = weeklyEquivalent / totalMealsPerWeek
        }
      }

      const totalPrice = unitPrice * item.quantity

      return {
        menuItem: {
          id: item.meal.id,
          name: item.meal.name,
          description: item.meal.description,
        },
        quantity: item.quantity,
        unitPrice: Math.round(unitPrice * 100) / 100, // Round to 2 decimal places
        totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
      }
    })

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
    const savedOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: user.id,
        status: 'pending',
        orderItems: orderItems.map((item) => ({
          menuItem: item.menuItem.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        allergenCharges,
        totalAllergenCharges,
        subtotal: orderResponse.subtotal,
        taxAmount: orderResponse.taxAmount,
        totalAmount: orderResponse.totalAmount,
        tier: tier?.id || null,
        subscriptionFrequency: subscriptionFrequency || null,
        mealsPerWeek: (user as any).meals_per_week || null,
        notes: `Order placed by ${user.name || user.email}`,
      },
    })

    console.log('Order saved to database:', savedOrder.id)

    return NextResponse.json({
      message: 'Order submitted successfully',
      order: orderResponse,
    })
  } catch (error) {
    console.error('Error submitting order:', error)
    return NextResponse.json({ message: 'Failed to submit order' }, { status: 500 })
  }
}
