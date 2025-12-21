// src/app/(frontend)/guest-checkout/checkout/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import GuestCheckoutFormClient from './GuestCheckoutFormClient'

export default async function GuestCheckoutPage() {
  const user = await getUser()

  // If user is authenticated, redirect to regular checkout
  if (user) {
    redirect('/checkout')
  }

  return <GuestCheckoutFormClient />
}

