import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import OrderHistoryClient from './OrderHistoryClient'


export default async function OrderHistoryPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login?redirect=/order-history')
  }

  return <OrderHistoryClient user={user} />
}
