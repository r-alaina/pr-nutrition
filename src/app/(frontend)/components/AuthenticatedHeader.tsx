'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import type { Customer } from '@/payload-types'

interface AuthenticatedHeaderProps {
  user?: Customer
}

export default function AuthenticatedHeader({ user }: AuthenticatedHeaderProps) {
  const pathname = usePathname()
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  const getLinkClass = (path: string, isOrderNow: boolean = false) => {
    let isActive = pathname === path
    if (isOrderNow) {
      isActive = pathname === '/meal-selection' || pathname === '/order-now'
    }
    return `font-medium transition-colors ${isActive ? 'text-[#5CB85C]' : 'text-gray-700'}`
  }

  const getLinkStyle = (path: string, isOrderNow: boolean = false) => {
    let isActive = pathname === path
    if (isOrderNow) {
      isActive = pathname === '/meal-selection' || pathname === '/order-now'
    }
    return isActive ? { color: '#5CB85C' } : { color: '#6B7280' }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopDropdownOpen(false)
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const orderNowHref = (user as any)?.preferences_set ? '/meal-selection' : '/order-now'
  const navLinks = [
    { href: '/', label: 'Home', isOrderNow: false },
    { href: '/menu', label: 'Menu', isOrderNow: false },
    { href: orderNowHref, label: 'Order Now', isOrderNow: true },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/brand/logo.png"
                alt="Meal PREPS Logo"
                width={150}
                height={48}
                className="h-10 sm:h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClass(link.href, link.isOrderNow)}
                style={getLinkStyle(link.href, link.isOrderNow)}
                onMouseEnter={(e) => {
                  const isActive = link.isOrderNow
                    ? pathname === '/meal-selection' || pathname === '/order-now'
                    : pathname === link.href
                  if (!isActive) {
                    e.currentTarget.style.color = '#5CB85C'
                  }
                }}
                onMouseLeave={(e) => {
                  const isActive = link.isOrderNow
                    ? pathname === '/meal-selection' || pathname === '/order-now'
                    : pathname === link.href
                  if (!isActive) {
                    e.currentTarget.style.color = '#6B7280'
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                aria-expanded={isDesktopDropdownOpen}
                aria-haspopup="true"
              >
                <span>{user?.name || 'User'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDesktopDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDesktopDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/account-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDesktopDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/preferences"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDesktopDropdownOpen(false)}
                  >
                    Manage Preferences
                  </Link>
                  <Link
                    href="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDesktopDropdownOpen(false)}
                  >
                    Order History
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => setIsDesktopDropdownOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 font-medium text-sm"
                aria-expanded={isMobileDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-xs sm:text-sm">{user?.name || 'User'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/account-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/preferences"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileDropdownOpen(false)}
                  >
                    Manage Preferences
                  </Link>
                  <Link
                    href="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileDropdownOpen(false)}
                  >
                    Order History
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => setIsMobileDropdownOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
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
              {navLinks.map((link) => {
                const isActive = link.isOrderNow
                  ? pathname === '/meal-selection' || pathname === '/order-now'
                  : pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'text-[#5CB85C] bg-green-50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
