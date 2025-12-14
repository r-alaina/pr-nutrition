import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Get the current user
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `payload-token=${token}` }),
    })

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const {
      tier,
      subscription_frequency,
      days_per_week,
      meals_per_day,
      include_breakfast,
      include_snacks,
      allergies,
      week_half,
      preferences_set,
    } = body

    // Calculate total meals per week
    let calculatedMealsPerWeek = body.meals_per_week // Default to passed value if available

    if (days_per_week && meals_per_day) {
      const days = parseInt(days_per_week, 10)
      const mealsPerDay = parseInt(meals_per_day, 10)
      const breakfastAddOn = include_breakfast ? 1 : 0
      
      // Formula: Days * (Base Meals + Breakfast)
      // e.g. 5 * (2 + 1) = 15 meals
      calculatedMealsPerWeek = days * (mealsPerDay + breakfastAddOn)
    }

    // Update the user's preferences
    const updatedUser = await payload.update({
      collection: 'customers',
      id: user.id,
      data: {
        tier: tier || null,
        subscription_frequency: subscription_frequency || null,
        days_per_week: days_per_week || null,
        meals_per_day: meals_per_day || null,
        meals_per_week: calculatedMealsPerWeek || null,
        include_breakfast: include_breakfast || false,
        include_snacks: include_snacks || false,
        allergies: allergies || [],
        week_half: week_half || null,
        preferences_set: preferences_set || false,
      },
    })

    return NextResponse.json({
      message: 'Preferences updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ message: 'Failed to update preferences' }, { status: 500 })
  }
}
