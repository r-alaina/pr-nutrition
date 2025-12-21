'use client'

import SharedHomeContent from './SharedHomeContent'

import AuthenticatedHeader from './AuthenticatedHeader'
import type { Customer } from '@/payload-types'



interface AuthenticatedHomeProps {
  user?: Customer
}

export default function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AuthenticatedHeader user={user} />

      <SharedHomeContent />
    </div>
  )
}
