'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Tier {
  id: string
  tier_name: string
  description: string
  weekly_price: number
  monthly_price: number
  single_price: number
}

export default function GuestCheckoutClient() {
  const router = useRouter()
  const pathname = usePathname()
  const [tiers, setTiers] = useState<Tier[]>([])
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getLinkClass = (path: string) => {
    const isActive = pathname === path
    return `font-medium transition-colors ${isActive ? 'text-[#5CB85C]' : 'text-gray-700'}`
  }

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path
    return isActive ? { color: '#5CB85C' } : { color: '#6B7280' }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/order-now', label: 'Order Now' },
    { href: '/login', label: 'Log In' },
  ]

  useEffect(() => {
    // Fetch tiers
    fetch('/api/tiers')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.docs) {
          setTiers(data.docs)
        } else {
          console.log('No tiers found in database')
          setTiers([])
        }
      })
      .catch((err) => {
        console.error('Error fetching tiers:', err)
        setTiers([])
      })
  }, [])

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier)
    // Store selected tier in sessionStorage for guest meal selection
    sessionStorage.setItem('guestTier', JSON.stringify(tier))
  }

  const handleContinue = () => {
    if (!selectedTier) {
      alert('Please select a tier to continue.')
      return
    }
    // Redirect to guest meal selection
    router.push('/guest-checkout/meals')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
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
                  onMouseEnter={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.color = '#5CB85C'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.color = '#6B7280'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/create-account"
                className="text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base"
                style={{ backgroundColor: '#5CB85C' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 lg:hidden">
              <Link
                href="/create-account"
                className="text-white px-3 py-1.5 rounded-lg transition-colors font-medium text-sm"
                style={{ backgroundColor: '#5CB85C' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
              >
                Sign Up
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-[#5CB85C] bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What's your calorie goal?</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Choose the tier that matches your nutritional needs.
          </p>
        </div>

        {/* Calorie Tier Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {tiers.length > 0 ? (
            tiers.map((tier) => (
              <div
                key={tier.id}
                onClick={() => handleTierSelect(tier)}
                className={`p-8 border-2 rounded-lg cursor-pointer transition-all text-center relative ${
                  selectedTier?.id === tier.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedTier?.id === tier.id && (
                  <div className="absolute top-3 right-3">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div className="text-xl font-semibold text-gray-900 mb-3">{tier.tier_name}</div>
                <div className="text-xl font-bold text-emerald-600">{tier.description}</div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">
                {tiers.length === 0
                  ? 'No tiers available. Please contact support.'
                  : 'Loading tiers...'}
              </p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedTier}
            className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Continue
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

