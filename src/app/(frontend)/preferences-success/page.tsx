import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import PreferencesSuccessClient from './PreferencesSuccessClient'
import type { Customer } from '@/payload-types'

export default async function PreferencesSuccessPage() {
  const user = await getUser()

  if (!user) {
    // Redirect to login if not authenticated
    return <div>Redirecting to login...</div>
  }

  return <PreferencesSuccessClient user={user} />
}
