'use client'

import Link from 'next/link'
import Image from 'next/image'
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
        href: user?.preferences_set ? '/meal-selection' : '/order-now',
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user ? (
        <AuthenticatedHeader user={user} />
      ) : (
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === link.href
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
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-sm mb-4">
                    Advanced Body Composition Analysis
                  </span>
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Analyze Your Body</span>{' '}
                    <span className="block text-brand-primary xl:inline">With Precision</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Get detailed insights into your body composition with our state-of-the-art Fit3D ProScanner. Visualize your progress, track your health metrics, and reach your goals faster.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <a
                        href="#contact"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark md:py-4 md:text-lg"
                      >
                        Book a Scan
                      </a>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        href="/menu"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-primary bg-green-100 hover:bg-green-200 md:py-4 md:text-lg"
                      >
                        View Meal Plans
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative bg-gray-100 overflow-hidden">
              <Image
                className="w-full h-full object-cover opacity-90"
                src="/images/fit3D/fit3d.png" // Using static image for better resolution in large hero area
                alt="Fit3D Scanner"
                width={800}
                height={800}
                priority // Important for LCP
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent lg:via-white/0"></div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Feature Cards Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-base text-brand-primary font-semibold tracking-wide uppercase">What You Get</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Comprehensive Body Insights
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Go beyond the scale with metrics that actually matter for your health journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-brand-primary rotate-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3D Body Avatar</h3>
                <p className="text-gray-600 leading-relaxed">
                  See a complete 360° model of your body. Rotate, zoom, and visualize your physique from every angle to track visual changes over time.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-brand-orange -rotate-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Body Composition</h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand your body fat percentage and lean muscle mass. Knowing these numbers helps you tailor your nutrition and fitness plan effectively.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 rotate-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tape Measurements</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get precise automated measurements for waist, hips, thighs, and more. No more manual measuring tape errors or inconsistencies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison / Why Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                  Why Choose a 3D Scan?
                </h2>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">Better Than a Scale</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Scales only tell you weight. A 3D scan tells you if you're losing fat or gaining muscle, which is crucial for long-term success.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">Stay Motivated</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Visualizing your physical changes helps you stay committed to your nutrition and workout plan when the scale isn't moving.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">Expert Accountability</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Review your results with our Registered Dietitian to adjust your meal plan based on real data, not guesswork.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-orange opacity-10 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-2">Detailed Reports</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Sample Data You'll Receive</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Body Fat %</span>
                      <span className="font-bold text-gray-900">Precise %</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Lean Mass</span>
                      <span className="font-bold text-gray-900">Total in lbs</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Waist Circumference</span>
                      <span className="font-bold text-gray-900">Inches</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Posture Analysis</span>
                      <span className="font-bold text-gray-900">Head to Toe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div id="contact" className="bg-brand-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready for your scan?</span>
                <span className="block text-green-200">Book your appointment today.</span>
              </h2>
              <p className="mt-3 text-lg text-green-100 max-w-lg">
                Contact our team to schedule your 15-minute Fit3D body scan session at our clinic.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 lg:w-1/2 justify-center lg:justify-end gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white border border-white/20 hover:bg-white/20 transition-colors w-full sm:w-auto text-center">
                <p className="text-sm font-medium text-green-200 uppercase tracking-wider mb-2">Call Us</p>
                <a href="tel:+19564242274" className="text-2xl font-bold block">(956) 424-2274</a>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white border border-white/20 hover:bg-white/20 transition-colors w-full sm:w-auto text-center">
                <p className="text-sm font-medium text-green-200 uppercase tracking-wider mb-2">Email Us</p>
                <a href="mailto:prnc@prdietitian.com" className="text-xl font-bold block">prnc@prdietitian.com</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Image
                src="/images/brand/logo.png"
                alt="Meal PREPS Logo"
                width={150}
                height={50}
                className="h-12 w-auto mb-4 mx-auto sm:mx-0"
              />
              <p className="text-gray-400 text-sm max-w-md">
                Nutritious meal preps crafted by Registered Dietitian Peggy Ramon-Rosales, MS, RD, LD.
                Helping you achieve your health goals with real food and real data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/menu" className="hover:text-white">Our Menu</Link></li>
                <li><Link href="/fit3d" className="hover:text-white">Fit3D Scan</Link></li>
                <li><Link href="/order-now" className="hover:text-white">Order Now</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>8025 N. 10th Street, Suite 160</li>
                <li>McAllen, TX 78504</li>
                <li>(956) 424-2274</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PR Nutrition. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
