'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Customer } from '@/payload-types'
import AuthenticatedHeader from '../components/AuthenticatedHeader'

interface CheckoutClientProps {
  user: Customer
}

export default function CheckoutClient({ user }: CheckoutClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePlaceOrder = async () => {
    setLoading(true)
    setMessage('')

    try {
      // TODO: Implement actual order placement
      console.log('Placing order for user:', user)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage('Order placed successfully! You will receive a confirmation email shortly.')

      // Redirect to home after successful order
      setTimeout(() => {
        router.push('/?message=order_placed')
      }, 3000)
    } catch (error) {
      console.error('Error placing order:', error)
      setMessage('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-xl text-gray-600">Review your order and complete your purchase</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.includes('successfully')
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tier:</span>
                <span className="font-semibold">{planSummary.tier}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-semibold">{planSummary.frequency}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Meals per Week:</span>
                <span className="font-semibold">{planSummary.mealsPerWeek}</span>
              </div>

              {planSummary.includeBreakfast && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Breakfast:</span>
                  <span className="font-semibold text-green-600">Included</span>
                </div>
              )}

              {planSummary.includeSnacks && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Snacks:</span>
                  <span className="font-semibold text-green-600">Included</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span style={{ color: '#5CB85C' }}>
                    {/* TODO: Calculate actual total based on tier and options */}$
                    {planSummary.mealsPerWeek === 10 ? '50' : '45'}/week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Order</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Information
                </label>
                <p className="text-sm text-gray-600">
                  Week Half:{' '}
                  <span className="font-semibold">
                    {(user as any).week_half === 'firstHalf'
                      ? 'First Half (Sunday & Monday)'
                      : (user as any).week_half === 'secondHalf'
                        ? 'Second Half (Wednesday & Thursday)'
                        : 'Not set'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Information
                </label>
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Restrictions:</span>{' '}
                    {(user as any).dietary_restrictions &&
                    (user as any).dietary_restrictions.length > 0
                      ? (user as any).dietary_restrictions
                          .map((dr: any) => dr.name || dr)
                          .join(', ')
                      : 'None'}
                  </p>
                  <p>
                    <span className="font-semibold">Allergies:</span>{' '}
                    {(user as any).allergies && (user as any).allergies.length > 0
                      ? (user as any).allergies.join(', ')
                      : 'None'}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full px-6 py-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#5CB85C' }}
                  onMouseEnter={(e) =>
                    !loading && (e.currentTarget.style.backgroundColor = '#4A9D4A')
                  }
                  onMouseLeave={(e) =>
                    !loading && (e.currentTarget.style.backgroundColor = '#5CB85C')
                  }
                >
                  {loading ? 'Processing Order...' : 'Place Order'}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/account-settings"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Need to update your preferences? Go to Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
