'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Customer } from '@/payload-types'
import AuthenticatedHeader from '../components/AuthenticatedHeader'

interface OrderSuccessClientProps {
  user: Customer | null
}

interface OrderItem {
  menuItem: {
    id: string
    name: string
    description: string
    price: number
  }
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface AllergenCharge {
  mealName: string
  quantity: number
  matchingAllergens: { allergen: string }[]
}

interface Order {
  id: string
  orderNumber: string
  status: string
  orderItems: OrderItem[]
  allergenCharges?: AllergenCharge[]
  totalAllergenCharges?: number
  subtotal: number
  subtotalWithAllergens?: number
  taxAmount: number
  totalAmount: number
  createdAt: string
  weekHalf?: 'firstHalf' | 'secondHalf' | 'both'
}

export default function OrderSuccessClient({ user }: OrderSuccessClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/order-now', label: 'Order Now' },
    { href: '/login', label: 'Log In' },
  ]

  const getLinkClass = (path: string) => {
    const isActive = pathname === path
    return `font-medium transition-colors ${isActive ? 'text-[#5CB85C]' : 'text-gray-700'}`
  }

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path
    return isActive ? { color: '#5CB85C' } : { color: '#6B7280' }
  }

  useEffect(() => {
    // Get order data from URL params
    const orderData = searchParams.get('order')
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(decodeURIComponent(orderData))
        setOrder(parsedOrder)
      } catch (error) {
        console.error('Error parsing order data:', error)
      }
    }
    setLoading(false)
  }, [searchParams])

  // Render guest header if no user
  const renderHeader = () => {
    if (user) {
      return <AuthenticatedHeader user={user} />
    }

    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/images/brand/logo.png"
                  alt="Meal PREPS Logo"
                  className="h-10 sm:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getLinkClass(link.href)}
                  style={getLinkStyle(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {renderHeader()}
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        {renderHeader()}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              We couldn&apos;t find your order details. Please try again.
            </p>
            <Link
              href={user ? '/meal-selection' : '/guest-checkout'}
              className="inline-flex items-center px-8 py-4 text-white rounded-lg font-semibold text-lg transition-colors"
              style={{ backgroundColor: '#5CB85C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
            >
              {user ? 'Back to Meal Selection' : 'Back to Order'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {renderHeader()}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Submitted Successfully!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order! We&apos;ll start preparing your meals.
          </p>
          <p className="text-lg text-gray-500">Order #{order.orderNumber}</p>
        </div>

        {/* Contact Info Box */}
        <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 mb-8">
          <p className="text-sm text-blue-800 text-center">
            Not sure which tier is right for you? We highly recommend calling us at{' '}
            <span className="font-bold text-blue-900">(956) 424-2247</span> or stopping by our
            office so Peggy, our registered dietitian, can help determine the best tier for your
            specific goals and needs.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 mb-8">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Meal Plan</h3>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.menuItem.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.menuItem.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription Details - Only show for authenticated users */}
            {user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Subscription Details</h4>
                <div className="text-sm text-blue-800">
                  <p>
                    <strong>Tier:</strong>{' '}
                    {typeof user.tier === 'object' && user.tier !== null
                      ? user.tier.tier_name
                      : 'Not specified'}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {user.subscription_frequency || 'Not specified'}
                  </p>
                  <p>
                    <strong>Meals per Week:</strong> {user.meals_per_week || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Allergen Charges Summary */}
            {order.allergenCharges && order.allergenCharges.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Allergen Accommodation Charges
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Additional charge for meals containing allergens you&apos;re sensitive to ($5.00
                  per order)
                </p>
                {order.allergenCharges.map((charge, index) => (
                  <div key={index} className="mb-3 p-3 bg-white rounded border border-yellow-300">
                    <p className="text-sm text-yellow-800">
                      <strong>{charge.mealName}</strong> (Qty: {charge.quantity})
                    </p>
                    <p className="text-xs text-yellow-700 ml-4">
                      Allergens: {charge.matchingAllergens.map((a) => a.allergen).join(', ')}
                    </p>
                  </div>
                ))}
                <div className="border-t border-yellow-300 pt-2 mt-2">
                  <p className="text-sm font-semibold text-yellow-900">
                    Total Allergen Charges: ${order.totalAllergenCharges?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {user
                    ? user.subscription_frequency === 'weekly'
                      ? 'Weekly Plan:'
                      : user.subscription_frequency === 'monthly'
                        ? 'Monthly Plan:'
                        : 'Plan:'
                    : 'Subtotal:'}
                </span>
                <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.totalAllergenCharges && order.totalAllergenCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Allergen Accommodation:</span>
                  <span className="font-semibold text-orange-600">
                    +{formatCurrency(order.totalAllergenCharges)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8.25%):</span>
                <span className="font-semibold">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span style={{ color: '#5CB85C' }}>{formatCurrency(order.totalAmount)}</span>
              </div>
              {user && (
                <div className="text-xs text-gray-500 mt-2">
                  {user.subscription_frequency === 'weekly'
                    ? 'Charged weekly'
                    : user.subscription_frequency === 'monthly'
                      ? 'Charged monthly'
                      : 'One-time charge'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Pickup Information</h3>
          <div className="space-y-3 text-green-800">
            {order.weekHalf === 'firstHalf' && (
              <p className="font-semibold">
                Please pick up your order on <strong>Sunday & Monday</strong> (First Half)
              </p>
            )}
            {order.weekHalf === 'secondHalf' && (
              <p className="font-semibold">
                Please pick up your order on <strong>Wednesday & Thursday</strong> (Second Half)
              </p>
            )}
            {order.weekHalf === 'both' && (
              <div>
                <p className="font-semibold mb-2">Please pick up your order according to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>First Half:</strong> Sunday & Monday
                  </li>
                  <li>
                    <strong>Second Half:</strong> Wednesday & Thursday
                  </li>
                </ul>
              </div>
            )}
            {!order.weekHalf && (
              <p className="font-semibold">
                Please pick up your order according to your selected week half
              </p>
            )}
            <p className="text-sm text-green-700 mt-4">
              We&apos;ll start preparing your meals according to your preferences and have them
              ready for pickup.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href={user ? '/meal-selection' : '/guest-checkout'}
            className="inline-flex items-center justify-center px-8 py-3 text-white rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
          >
            Place Another Order
          </Link>
        </div>
      </div>
    </div>
  )
}
