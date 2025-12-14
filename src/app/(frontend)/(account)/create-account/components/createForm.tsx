'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { create, type Response } from '@/app/(frontend)/(account)/create-account/actions/create'
import Link from 'next/link'

interface CreateFormProps {
  redirectPath?: string
}

export default function CreateForm({ redirectPath }: CreateFormProps): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = redirectPath || searchParams.get('redirect')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const result: Response = await create({ email, password, name })
    setIsLoading(false)

    if (result.success) {
      // Redirect to login with redirect parameter if specified
      const loginUrl = redirect
        ? `/login?message=${encodeURIComponent('Account created successfully! Please login.')}&redirect=${encodeURIComponent(redirect)}`
        : `/login?message=${encodeURIComponent('Account created successfully! Please login.')}`
      router.push(loginUrl)
    } else {
      setError(result.error || 'An error occurred.')
    }
  }

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to start ordering meals.</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent"
              placeholder="At least 6 characters"
            />
            <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters long</p>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5CB85C] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#4A9A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Guest Checkout Link */}
        <div className="mt-6 text-center">
          <Link
            href="/guest-checkout"
            className="block w-full text-center text-[#5CB85C] hover:underline font-medium py-2 border border-[#5CB85C] rounded-xl hover:bg-green-50 transition-colors"
          >
            Continue as Guest
          </Link>
        </div>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
              className="text-[#5CB85C] hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
