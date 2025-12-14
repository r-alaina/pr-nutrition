'use client'

import { useEffect } from 'react'
import { logout } from '@/app/(frontend)/(auth)/actions/logout'

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout()
        // Force a hard refresh to clear any cached state
        window.location.href = '/'
      } catch (error) {
        console.error('Logout error:', error)
        // Still redirect even if logout fails
        window.location.href = '/'
      }
    }

    handleLogout()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  )
}
