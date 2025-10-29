// src/app/(frontend)/order-now/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import OrderNowClient from './OrderNowClient'

export default async function OrderNowPage() {
  const user = await getUser()

  // Require authentication to proceed with order
  if (!user) {
    redirect('/login?redirect=/order-now')
  }

  // If user has preferences set, redirect to meal selection
  if (user.preferences_set) {
    redirect('/meal-selection')
  }

  // Check if user has preferences set up
  const isNewUser = !user?.preferences_set

  // Get user preferences if they exist
  const userPreferences = user
    ? {
        tier: user.tier as any,
        subscription_frequency: user.subscription_frequency || undefined,
        meals_per_week: user.meals_per_week || undefined,
        include_breakfast: user.include_breakfast || false,
        include_snacks: user.include_snacks || false,
        dietary_restrictions: user.dietary_restrictions?.map((dr: any) => dr.id || dr) || [],
        allergies: user.allergies || [],
        week_half: user.week_half || undefined,
      }
    : undefined

  return <OrderNowClient isNewUser={isNewUser} user={user} userPreferences={userPreferences} />
}
