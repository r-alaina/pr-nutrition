'use client'

import SharedHomeContent from './SharedHomeContent'

import AuthenticatedHeader from './AuthenticatedHeader'
import type { Customer } from '@/payload-types'



interface AuthenticatedHomeProps {
  user?: Customer
  challengeBanner?: React.ReactNode
}

export default function AuthenticatedHome({ user, challengeBanner }: AuthenticatedHomeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AuthenticatedHeader user={user} />

      <SharedHomeContent challengeBanner={challengeBanner} />
    </div>
  )
}
