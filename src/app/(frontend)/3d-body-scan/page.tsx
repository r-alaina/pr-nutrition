import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { redirect } from 'next/navigation'
import BodyScanClient from './BodyScanClient'

export default async function BodyScanPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login?redirect=/3d-body-scan')
  }

  return <BodyScanClient user={user} />
}
