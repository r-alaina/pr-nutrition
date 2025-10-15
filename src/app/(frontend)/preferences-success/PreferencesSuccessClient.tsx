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
    const includeBreakfast = (user as any).include_breakfast
    const includeSnacks = (user as any).include_snacks

    return {
      tier: tier?.tier_name || 'Not selected',
      frequency: frequency || 'Not selected',
      mealsPerWeek: mealsPerWeek || 'Not selected',
      includeBreakfast: includeBreakfast || false,
      includeSnacks: includeSnacks || false,
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
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Plan Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Tier:</span>
                <span className="font-semibold text-lg">{planSummary.tier}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Frequency:</span>
                <span className="font-semibold text-lg">{planSummary.frequency}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Meals per Week:</span>
                <span className="font-semibold text-lg">{planSummary.mealsPerWeek}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Breakfast:</span>
                <span
                  className={`font-semibold text-lg ${planSummary.includeBreakfast ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {planSummary.includeBreakfast ? 'Included' : 'Not included'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Snacks:</span>
                <span
                  className={`font-semibold text-lg ${planSummary.includeSnacks ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {planSummary.includeSnacks ? 'Included' : 'Not included'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Pickup Time:</span>
                <span className="font-semibold text-lg">
                  {(user as any).preferred_pickup_time || 'Not set'}
                </span>
              </div>
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
