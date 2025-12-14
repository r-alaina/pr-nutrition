// src/app/(frontend)/guest-checkout/allergens/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import GuestAllergensClient from './GuestAllergensClient'

export default async function GuestAllergensPage() {
  const user = await getUser()

  // If user is authenticated, redirect to regular preferences
  if (user) {
    redirect('/preferences')
  }

  return <GuestAllergensClient />
}
