import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import BodyScanClient from './BodyScanClient'

export default async function Fit3DPage() {
  const user = await getUser()

  return <BodyScanClient user={user || undefined} />
}
