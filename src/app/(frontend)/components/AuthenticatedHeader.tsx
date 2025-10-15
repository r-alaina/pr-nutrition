'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import type { Customer } from '@/payload-types'

interface AuthenticatedHeaderProps {
  user?: Customer
}

export default function AuthenticatedHeader({ user }: AuthenticatedHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="/images/brand/logo.png" alt="Meal PREPS Logo" className="h-12 w-auto" />
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="font-medium" style={{ color: '#5CB85C' }}>
              Home
            </Link>
            <Link
              href="/menu"
              className="text-gray-700 font-medium"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#5CB85C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
            >
              Menu
            </Link>
            <Link
              href={(user as any)?.preferences_set ? '/meal-selection' : '/order-now'}
              className="text-gray-700 font-medium"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#5CB85C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
            >
              {(user as any)?.preferences_set ? 'Order Meals' : 'Order Now'}
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                <span>{user?.name || 'User'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/account-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/preferences"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Manage Preferences
                  </Link>
                  <Link
                    href="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Order History
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
