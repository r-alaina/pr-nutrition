import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import OrderSuccessClient from './OrderSuccessClient'


export default async function OrderSuccessPage() {
  const user = await getUser()

  if (!user) {
    // Redirect to login if not authenticated
    return <div>Redirecting to login...</div>
  }

  return <OrderSuccessClient user={user} />
}
