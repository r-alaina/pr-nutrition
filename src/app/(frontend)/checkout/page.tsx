import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import CheckoutClient from './CheckoutClient'
import type { Customer } from '@/payload-types'

export default async function CheckoutPage() {
  const user = await getUser()

  if (!user) {
    // Redirect to login if not authenticated
    return <div>Redirecting to login...</div>
  }

  return <CheckoutClient user={user} />
}
