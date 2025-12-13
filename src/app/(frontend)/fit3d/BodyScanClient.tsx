'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import AuthenticatedHeader from '../components/AuthenticatedHeader'
import type { Customer } from '@/payload-types'

interface BodyScanClientProps {
  user?: Customer
}

export default function BodyScanClient({ user }: BodyScanClientProps) {
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

  const navLinks = user
    ? [
        { href: '/', label: 'Home' },
        { href: '/menu', label: 'Menu' },
        {
          href: (user as any)?.preferences_set ? '/meal-selection' : '/order-now',
          label: 'Order Now',
        },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/menu', label: 'Menu' },
        { href: '/order-now', label: 'Order Now' },
        { href: '/login', label: 'Log In' },
      ]

  return (
    <div className="min-h-screen bg-white">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">3D Body Scan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed insights into your body composition and track your progress with precision
          </p>
        </div>

        {/* What You'll Get Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            What You'll Get from Your 3D Body Scan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 bg-[#5CB85C] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">3D Avatar</h3>
              <p className="text-gray-600 text-center">
                See a detailed 3D model of your body that you can view from any angle on your
                computer or device
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 bg-[#5CB85C] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Circumference Measurements
              </h3>
              <p className="text-gray-600 text-center">
                Get precise measurements of your hips, waist, thighs, neck, biceps, and other key
                body areas
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 bg-[#5CB85C] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Body Composition
              </h3>
              <p className="text-gray-600 text-center">
                See your body fat percentage and lean muscle mass for each body part to track your
                fitness progress accurately
              </p>
            </div>
          </div>
        </div>

        {/* About 3D Body Scanning Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            About 3D Body Scanning
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                3D body scanning is a technology that captures highly accurate and detailed images
                of your body to produce a precise 3D model. This model can be viewed on your
                computer or digital device, giving you a comprehensive view of your body
                composition.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                One of the most popular applications of this technology is helping individuals
                achieve their weight loss and fitness goals. By providing detailed measurements and
                body composition data, 3D body scanning gives you insights that go beyond what a
                scale can tell you.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                A true 3D body scanner provides you with:
              </p>
              <ul className="list-none mt-4 space-y-3 text-lg text-gray-700 max-w-2xl mx-auto">
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#5CB85C] rounded-full mr-3"></span>A 3D avatar of
                  yourself
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#5CB85C] rounded-full mr-3"></span>
                  Circumference measurements at key points (thighs, neck, biceps, etc.)
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#5CB85C] rounded-full mr-3"></span>
                  Body composition values including body fat percentage and lean muscle mass
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Get a 3D Body Scan?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#5CB85C] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Track Progress Accurately
                </h3>
                <p className="text-gray-600">
                  See changes in your body that the scale might not show, including muscle gain and
                  fat loss distribution
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#5CB85C] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Motivated</h3>
                <p className="text-gray-600">
                  Visual proof of your progress helps maintain motivation and accountability on your
                  fitness journey
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#5CB85C] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Insights</h3>
                <p className="text-gray-600">
                  Get comprehensive data about your body composition to make informed decisions
                  about your health and fitness
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#5CB85C] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Better Goals</h3>
                <p className="text-gray-600">
                  Use precise measurements to set realistic goals and track your progress more
                  effectively
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#5CB85C] to-[#4A9D4A] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-95">
            Contact Peggy to schedule your 3D body scan and start tracking your progress with
            precision
          </p>
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md mx-auto shadow-lg">
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Call Us</p>
                <a
                  href="tel:+19564242274"
                  className="text-2xl font-bold text-[#5CB85C] hover:text-[#4A9D4A] transition-colors"
                >
                  (956) 424-2274
                </a>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm font-semibold mb-1">Email Us</p>
                <a
                  href="mailto:prnc@prdietitian.com"
                  className="text-xl font-semibold text-[#5CB85C] hover:text-[#4A9D4A] transition-colors"
                >
                  prnc@prdietitian.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
