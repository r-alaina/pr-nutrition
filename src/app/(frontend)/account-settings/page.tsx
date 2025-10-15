// src/app/(frontend)/account-settings/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import AccountSettingsClient from './AccountSettingsClient'

export default async function AccountSettingsPage() {
  const user = await getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You must be logged in to access account settings.</p>
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return <AccountSettingsClient user={user} />
}
