// src/app/(frontend)/order-now/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import OrderNowClient from './OrderNowClient'

export default async function OrderNowPage() {
  const user = await getUser()

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
        preferred_pickup_time: user.preferred_pickup_time || undefined,
      }
    : undefined

  return <OrderNowClient isNewUser={isNewUser} user={user} userPreferences={userPreferences} />
}
