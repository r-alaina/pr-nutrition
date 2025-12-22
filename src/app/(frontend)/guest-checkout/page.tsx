// src/app/(frontend)/guest-checkout/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import GuestCheckoutClient from './GuestCheckoutClient'

export default async function GuestCheckoutPage() {
  const user = await getUser()

  // If user is authenticated, redirect to regular order flow
  if (user) {
    if (user.preferences_set) {
      redirect('/meal-selection')
    } else {
      redirect('/order-now')
    }
  }

  // Guest checkout is temporarily disabled
  redirect('/login')

  return <GuestCheckoutClient />
}

