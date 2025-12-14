'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

export default function UnauthenticatedHome() {
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

      {/* Hero Section */}
      <section
        className="py-20 relative"
        style={{
          background: 'linear-gradient(135deg, #5CB85C 0%, #4A9D4A 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto mb-12 shadow-lg">
            <div className="flex items-center justify-center">
              <Image
                src="/images/brand/logo.png"
                alt="Meal PREPS Logo"
                width={400}
                height={160}
                className="h-40 md:h-48 w-auto"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Nutritious Meal Preps with Real Results
          </h1>

          <p className="text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
            PR Meal Preps specializes in providing you the most delicious and perfectly portioned
            meals. Our dietitian, Peggy, will ensure your tailored nutrient tier is precise for you
            to help meet your goals. Whether you&apos;d like to work on managing your diabetes,
            maintaining your gains, slimming down, or just being the healthiest version of yourself,
            feel confident knowing you have an experienced registered dietitian managing your food
            intake.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/order-now"
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#F7931E' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8851C')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F7931E')}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Build Your Plan
            </Link>
            <Link
              href="/menu"
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg border-2 border-white"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              View Menu
            </Link>
          </div>

          <div className="flex justify-center space-x-8">
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Locally Sourced</span>
            </div>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Nutritionist Approved</span>
            </div>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Made Fresh Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fit 3D Body Scan Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Fit 3D Body Scan</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your progress with precision using our state-of-the-art Fit 3D body scanning
            technology. Get detailed insights into your body composition and see real results over
            time.
          </p>
          <Link
            href="/fit3d"
            className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
          >
            Learn More About Fit 3D
          </Link>
        </div>
      </section>

      {/* Browse Our Meal Plans Button */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/menu"
            className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
          >
            Browse Our Meal Plans
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">
              Simple, flexible, and designed around your life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: '#5CB85C' }}
                >
                  1
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F7931E' }}
                >
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Your Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Answer a few quick questions about your goals. Choose your tier, frequency, and
                add-ons.
              </p>
            </div>

            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: '#5CB85C' }}
                >
                  2
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F7931E' }}
                >
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pick Your Meals</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our weekly menu and select your favorites. We accommodate all dietary needs.
              </p>
            </div>

            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: '#5CB85C' }}
                >
                  3
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F7931E' }}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoy Fresh Meals</h3>
              <p className="text-gray-600 leading-relaxed">
                Pick up your meals twice weekly. Freshly made, perfectly portioned, ready to heat
                and eat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flexible Plans for Your Lifestyle Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Flexible Plans for Your Lifestyle
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to succeed on your health journey.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(92, 184, 92, 0.1)' }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: '#5CB85C' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Monthly Plans with Credits
                  </h3>
                  <p className="text-gray-600">
                    Pay monthly, allocate credits across weeks. Skip one week per month and keep
                    your credits.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(92, 184, 92, 0.1)' }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: '#5CB85C' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Dietary Accommodations
                  </h3>
                  <p className="text-gray-600">
                    Set your allergies and dietary restrictions. We&apos;ll flag them on every order and
                    customize accordingly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(92, 184, 92, 0.1)' }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: '#5CB85C' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Extras Anytime</h3>
                  <p className="text-gray-600">
                    Go beyond your meal limit - extra meals, snacks, and add-ons available for
                    additional cost.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(92, 184, 92, 0.1)' }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: '#5CB85C' }}
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l5-10A1 1 0 0019 1H3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">A La Carte Available</h3>
                  <p className="text-gray-600">
                    No commitment needed - order individual meals whenever you want. Perfect for
                    trying us out!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/images/brand/logo.png"
                  alt="Meal PREPS Logo"
                  width={200}
                  height={64}
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-gray-300 text-sm">
                Nutritious meal preps crafted by Registered Dietitian Peggy Ramon-Rosales, MS, RD,
                LD
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>8025 N. 10th Street, Suite 160</p>
                <p>McAllen, Texas 78504</p>
                <p>(956) 424-2274</p>
                <p>prnc@prdietitian.com</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-gray-300 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="block text-gray-300 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Menu
                </Link>
                <Link
                  href="/order-now"
                  className="block text-gray-300 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025, PR Meal Preps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
