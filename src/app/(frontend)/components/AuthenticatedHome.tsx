'use client'

import Link from 'next/link'
import Image from 'next/image'
import AuthenticatedHeader from './AuthenticatedHeader'
import type { Customer } from '@/payload-types'

interface AuthenticatedHomeProps {
  user?: Customer
}

export default function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AuthenticatedHeader user={user} />

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
                priority
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
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              style={{ backgroundColor: '#5CB85C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
              <p className="text-gray-600">
                Select from our variety of meal plans designed by our registered dietitian to meet
                your specific nutritional goals.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customize Your Meals</h3>
              <p className="text-gray-600">
                Personalize your meals based on your dietary preferences, restrictions, and
                nutritional requirements.
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
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pick Up & Enjoy</h3>
              <p className="text-gray-600">
                Collect your fresh, perfectly portioned meals at our convenient pickup times and
                enjoy your healthy lifestyle.
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/brand/logo.png"
                  alt="Meal PREPS Logo"
                  width={200}
                  height={64}
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Fresh, healthy meals prepared with care by our registered dietitian. Your journey to
                better nutrition starts here.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="font-semibold">Phone:</span> (956) 424-2274
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Email:</span> prnc@prdietitian.com
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Address:</span> 123 Main St, McAllen, TX 78501
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/menu" className="text-gray-300 hover:text-white transition-colors">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order-now"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Order Now
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-account"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account-settings"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Account Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 PR Nutrition. All rights reserved. | Peggy Ramon-Rosales, MS, RD, LD
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
