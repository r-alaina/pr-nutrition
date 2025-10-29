'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAdmin, type AdminSignupResponse } from '@/app/(frontend)/admin-signup/actions/create'
import Link from 'next/link'

export default function AdminSignupForm(): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result: AdminSignupResponse = await createAdmin({ email, password })
    setIsLoading(false)

    if (result.success) {
      router.push(
        '/admin/login?message=' + encodeURIComponent('Account created successfully! Please login.'),
      )
    } else {
      setError(result.error || 'An error occurred.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #5CB85C 0%, #4A9D4A 100%)',
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/images/brand/logo.png" alt="Meal PREPS Logo" className="h-16 w-auto" />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign Up</h1>
          <p className="text-gray-600">Create an account for admin access</p>
          <p className="text-sm text-gray-500 mt-2">
            Note: You will be assigned the "User" role. An existing admin can upgrade your role
            later.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email <span className="text-red-500">*</span>
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
              Password <span className="text-red-500">*</span>
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
            className="w-full bg-[#5CB85C] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#4A9D4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an admin account?{' '}
            <Link href="/admin/login" className="text-[#5CB85C] hover:underline font-medium">
              Log in
            </Link>
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            Looking for customer account?{' '}
            <Link href="/create-account" className="text-[#5CB85C] hover:underline font-medium">
              Sign up as customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
