'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { MenuItem, Customer } from '@/payload-types'
import AuthenticatedHeader from '../../components/AuthenticatedHeader'

interface MenuClientProps {
  groupedItems: Record<string, MenuItem[]>
  categoryOrder: Array<{ key: string; label: string }>
  user?: Customer
}

export default function MenuClient({ groupedItems, categoryOrder, user }: MenuClientProps) {
  const pathname = usePathname()
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {user ? (
        <AuthenticatedHeader user={user} />
      ) : (
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
      )}

      {/* Pickup Times Banner */}
      <div className="text-white py-6" style={{ backgroundColor: '#5CB85C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Pick-Up Times</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">1st Half Menu:</p>
                <p className="text-sm mb-1">SUNDAY 3pm-6pm & MONDAY 10am-6pm</p>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Order deadline: 12am (midnight)
                </p>
              </div>
              <div
                className="hidden lg:block w-px h-16"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              ></div>
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">2nd Half Menu:</p>
                <p className="text-sm mb-1">WEDNESDAY 3pm-6pm & THURSDAY 10am-6pm</p>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Order deadline: Tuesday at 5pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600">Fresh, healthy meals prepared with care</p>
        </div>

        {/* Menu Categories */}
        {categoryOrder.map(({ key, label }) => {
          const items = groupedItems[key] || []
          if (items.length === 0) return null

          return (
            <div key={key} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{label}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <div className="flex justify-center items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                          {item.category === 'premium' && (
                            <span
                              className="text-white text-xs font-semibold px-2 py-1 rounded"
                              style={{ backgroundColor: '#F7931E' }}
                            >
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed text-center">
                        {item.description}
                      </p>

                      {/* Allergens */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Allergens:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.allergens.map((allergen, index) => (
                              <span
                                key={index}
                                className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                              >
                                {allergen.allergen}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center space-y-3">
                        {item.category === 'snack' && item.price ? (
                          <span className="text-2xl font-bold" style={{ color: '#5CB85C' }}>
                            ${(item.price || 0).toFixed(2)}
                          </span>
                        ) : (
                          user &&
                          (user as any).preferences_set && (
                            <span className="text-lg text-gray-600">
                              {item.category === 'snack'
                                ? 'A la carte'
                                : 'Included in subscription'}
                            </span>
                          )
                        )}
                        <Link
                          href={
                            user && (user as any).preferences_set ? '/meal-selection' : '/order-now'
                          }
                          className="text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                          style={{ backgroundColor: '#5CB85C' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
                        >
                          {user && (user as any).preferences_set ? 'Order Meals' : 'Order Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h3>
          <p className="text-gray-600 mb-6">Choose your meals and place your order for pickup</p>
          <Link
            href="/order-now"
            className="text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
          >
            Start Ordering
          </Link>
        </div>
      </div>
    </div>
  )
}
