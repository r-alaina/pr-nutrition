'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface MenuItem {
  id: number | string
  name: string
  category: string
  price: number
  description?: string
  allergens?: Array<{ allergen: string }>
}

interface Tier {
  id: number | string
  tier_name: string
  weekly_price: number
  monthly_price: number
  single_price: number
}

interface SelectedMeal {
  meal: MenuItem
  quantity: number
  weekHalf: 'firstHalf' | 'secondHalf'
}

export default function GuestCheckoutFormClient() {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [guestTier, setGuestTier] = useState<Tier | null>(null)
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    // Load data from sessionStorage
    const storedTier = sessionStorage.getItem('guestTier')
    const storedMeals = sessionStorage.getItem('guestSelectedMeals')
    const storedAllergies = sessionStorage.getItem('guestAllergies')

    if (storedTier) {
      try {
        setGuestTier(JSON.parse(storedTier))
      } catch (e) {
        console.error('Error parsing stored tier:', e)
      }
    }

    if (storedMeals) {
      try {
        setSelectedMeals(JSON.parse(storedMeals))
      } catch (e) {
        console.error('Error parsing stored meals:', e)
      }
    }

    if (storedAllergies) {
      try {
        setAllergies(JSON.parse(storedAllergies))
      } catch (e) {
        console.error('Error parsing stored allergies:', e)
      }
    }

    // If no tier or meals, redirect back
    if (!storedTier || !storedMeals) {
      router.push('/guest-checkout')
    }
  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateTotal = () => {
    if (!guestTier) return 0

    const tierPrice = guestTier.weekly_price || 0
    const snackTotal = selectedMeals
      .filter((item) => item.meal.category === 'snack')
      .reduce((sum, item) => sum + (item.meal.price || 0) * item.quantity, 0)

    // Allergen charge: $5 if any allergies selected
    const allergenCharge = allergies.length > 0 ? 5.0 : 0

    const subtotal = tierPrice + snackTotal + allergenCharge
    const tax = subtotal * 0.0825
    return subtotal + tax
  }

  const getWeekHalf = () => {
    // Determine week half from selected meals
    const mealWeeks = new Set(selectedMeals.map((item) => item.weekHalf || 'firstHalf'))
    if (mealWeeks.size > 1) return 'both'
    return mealWeeks.has('secondHalf') ? 'secondHalf' : 'firstHalf'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Please fill in all required fields (First Name, Last Name, Email, Phone)')
        setLoading(false)
        return
      }

      // Create customer account and submit order
      const response = await fetch('/api/orders/submit-guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: {
            ...formData,
            allergies: allergies,
          },
          tier: guestTier,
          selectedMeals,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Order submission error:', errorData)
        throw new Error(errorData.message || errorData.error || 'Failed to submit order')
      }

      const result = await response.json()
      console.log('Order submission success:', result)
      const { order } = result

      // Clear sessionStorage
      sessionStorage.removeItem('guestTier')
      sessionStorage.removeItem('guestSelectedMeals')
      sessionStorage.removeItem('guestAllergies')

      // Redirect to success page
      const orderData = encodeURIComponent(JSON.stringify(order))
      router.push(`/order-success?order=${orderData}`)
    } catch (error) {
      console.error('Error submitting order:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  if (!guestTier || selectedMeals.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your order details.</p>
        </div>
      </div>
    )
  }

  const tierPrice = guestTier.weekly_price || 0
  const snackTotal = selectedMeals
    .filter((item) => item.meal.category === 'snack')
    .reduce((sum, item) => sum + (item.meal.price || 0) * item.quantity, 0)
  const allergenCharge = allergies.length > 0 ? 5.0 : 0
  const subtotal = tierPrice + snackTotal + allergenCharge
  const tax = subtotal * 0.0825
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        <div className="flex flex-col items-center gap-8">
          {/* Order Summary */}
          <div className="w-full max-w-2xl">
            <div
              className="p-6 mb-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(92, 184, 92, 0.08) 0%, rgba(247, 147, 30, 0.12) 25%, rgba(92, 184, 92, 0.15) 50%, rgba(247, 147, 30, 0.1) 75%, rgba(92, 184, 92, 0.08) 100%), linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                borderColor: 'rgba(92, 184, 92, 0.2)',
                borderWidth: '2px',
                borderRadius: '16px',
                boxSizing: 'border-box',
              }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tier</h3>
                  <p className="text-gray-700">{guestTier.tier_name}</p>
                  <p className="text-gray-600 text-sm">${tierPrice.toFixed(2)}</p>
                </div>

                {selectedMeals.filter((item) => item.meal.category === 'snack').length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Snacks</h3>
                    {selectedMeals
                      .filter((item) => item.meal.category === 'snack')
                      .map((item, index) => (
                        <div key={index} className="flex justify-between mb-1">
                          <span className="text-gray-700">
                            {item.meal.name} x{item.quantity}
                          </span>
                          <span className="text-gray-700">
                            ${((item.meal.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    <p className="text-gray-600 text-sm mt-2">Subtotal: ${snackTotal.toFixed(2)}</p>
                  </div>
                )}

                {allergies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Allergen Charge</h3>
                    <p className="text-gray-700">
                      {allergies.length} {allergies.length === 1 ? 'allergen' : 'allergens'}{' '}
                      selected
                    </p>
                    <p className="text-gray-600 text-sm">${allergenCharge.toFixed(2)}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Tax (8.25%)</span>
                    <span className="text-gray-700">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <Link
                      href="/guest-checkout/allergens"
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
