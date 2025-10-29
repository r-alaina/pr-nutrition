'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Customer } from '@/payload-types'
import AuthenticatedHeader from '../components/AuthenticatedHeader'

interface PreferencesSuccessClientProps {
  user: Customer
}

export default function PreferencesSuccessClient({ user }: PreferencesSuccessClientProps) {
  const router = useRouter()

  const getPlanSummary = () => {
    const tier = (user as any).tier
    const frequency = (user as any).subscription_frequency
    const mealsPerWeek = (user as any).meals_per_week

    return {
      tier: tier?.tier_name || 'Not selected',
      frequency: frequency || 'Not selected',
      mealsPerWeek: mealsPerWeek || 'Not selected',
    }
  }

  const planSummary = getPlanSummary()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AuthenticatedHeader user={user} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Preferences Saved Successfully!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your meal plan preferences have been saved. Now you can order your meals!
          </p>
        </div>

        {/* Plan Summary */}
        <div
          className="p-6 border mb-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(92, 184, 92, 0.08) 0%, rgba(247, 147, 30, 0.12) 25%, rgba(92, 184, 92, 0.15) 50%, rgba(247, 147, 30, 0.1) 75%, rgba(92, 184, 92, 0.08) 100%), linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
            borderColor: 'rgba(92, 184, 92, 0.2)',
            borderWidth: '2px',
            borderRadius: '16px',
            boxSizing: 'border-box',
          }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Plan Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-dashed border-gray-300 pb-3">
              <span className="text-gray-600">Tier:</span>
              <span className="font-semibold text-gray-900">{planSummary.tier}</span>
            </div>

            <div className="flex justify-between border-b border-dashed border-gray-300 pb-3">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {planSummary.frequency === 'weekly'
                  ? 'Weekly'
                  : planSummary.frequency === 'monthly'
                    ? 'Monthly'
                    : planSummary.frequency}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Meals per week:</span>
              <span className="font-semibold text-gray-900">{planSummary.mealsPerWeek}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link
            href="/meal-selection"
            className="inline-flex items-center px-8 py-4 text-white rounded-lg font-semibold text-lg transition-colors"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
          >
            Order Your Meals
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="text-sm text-gray-600">
            <Link href="/account-settings" className="hover:text-gray-800 transition-colors">
              Or update your preferences in Account Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
