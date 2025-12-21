'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import SharedHomeContent from './SharedHomeContent'



interface UnauthenticatedHomeProps {
  challengeBanner?: React.ReactNode
}

export default function UnauthenticatedHome({ challengeBanner }: UnauthenticatedHomeProps) {
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
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${pathname === link.href ? 'text-brand-primary' : 'text-gray-700 hover:text-brand-primary'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/create-account"
                className="text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base bg-brand-primary hover:bg-brand-dark"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 lg:hidden">
              <Link
                href="/create-account"
                className="text-white px-3 py-1.5 rounded-lg transition-colors font-medium text-sm bg-brand-primary hover:bg-brand-dark"
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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === link.href
                      ? 'text-brand-primary bg-green-50'
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

      <SharedHomeContent challengeBanner={challengeBanner} />
    </div>
  )
}
