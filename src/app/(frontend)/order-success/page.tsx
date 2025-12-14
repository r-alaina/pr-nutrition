import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import OrderSuccessClient from './OrderSuccessClient'
import type { Customer } from '@/payload-types'

export default async function OrderSuccessPage() {
  const user = await getUser()

  // Allow both authenticated and guest users to see the success page
  // Guest users will have order data in URL params
  return <OrderSuccessClient user={user || null} />
}
