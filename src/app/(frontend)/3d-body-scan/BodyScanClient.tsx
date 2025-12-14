'use client'

import AuthenticatedHeader from '../components/AuthenticatedHeader'
import type { Customer } from '@/payload-types'

interface BodyScanClientProps {
  user: Customer
}

export default function BodyScanClient({ user }: BodyScanClientProps) {
  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader user={user} />

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
            What You&apos;ll Get from Your 3D Body Scan
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
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              3D body scanning is a technology that captures highly accurate and detailed images of
              your body to produce a precise 3D model. This model can be viewed on your computer or
              digital device, giving you a comprehensive view of your body composition.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              One of the most popular applications of this technology is helping individuals achieve
              their weight loss and fitness goals. By providing detailed measurements and body
              composition data, 3D body scanning gives you insights that go beyond what a scale can
              tell you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              A true 3D body scanner provides you with:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-lg text-gray-700">
              <li>A 3D avatar of yourself</li>
              <li>Circumference measurements at key points (thighs, neck, biceps, etc.)</li>
              <li>Body composition values including body fat percentage and lean muscle mass</li>
            </ul>
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
            Get your 3D body scan today and start tracking your progress with precision
          </p>
          <a
            href="https://www.fit3d.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#5CB85C] font-semibold px-8 py-4 rounded-xl text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Your 3D Body Scan
          </a>
          <p className="text-sm mt-4 opacity-90">
            You&apos;ll be redirected to Fit3D to complete your scan
          </p>
        </div>
      </div>
    </div>
  )
}
