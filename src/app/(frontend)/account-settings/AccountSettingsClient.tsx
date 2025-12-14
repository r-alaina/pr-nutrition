'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface User {
  id: string
  name?: string
  email?: string
  tier?: any
  subscription_frequency?: string
  meals_per_week?: number
  include_breakfast?: boolean
  include_snacks?: boolean
  allergies?: string[]
  week_half?: string
  preferences_set?: boolean
}

interface AccountSettingsClientProps {
  user: User
}

export default function AccountSettingsClient({ user: initialUser }: AccountSettingsClientProps) {
  const [user, setUser] = useState(initialUser)
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      const response = await fetch('/api/customers/get-user')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        setProfileData({
          name: userData.user.name || '',
          email: userData.user.email || '',
        })
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData()
  }, [])

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/customers/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      setMessage('Profile updated successfully!')
      setIsEditingProfile(false)
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/customers/update-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: user.tier?.id || null,
          subscription_frequency: user.subscription_frequency || null,
          meals_per_week: user.meals_per_week || null,
          include_breakfast: user.include_breakfast || false,
          include_snacks: user.include_snacks || false,
          allergies: user.allergies || [],
          week_half: user.week_half || null,
          preferences_set: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update preferences')
      }

      setMessage('Preferences updated successfully!')
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

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
                  width={500}
                  height={200}
                  className="h-10 sm:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
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
                href="/order-now"
                className="text-gray-700 font-medium"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5CB85C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
              >
                Order Now
              </Link>
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors bg-gray-50"
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors bg-gray-50"
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
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-[#5CB85C] bg-green-50"
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  Menu
                </Link>
                <Link
                  href="/order-now"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  Order Now
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.includes('Error')
                ? 'bg-red-100 border border-red-400 text-red-700'
                : 'bg-green-100 border border-green-400 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 text-white rounded-md transition-colors"
                style={{ backgroundColor: '#5CB85C' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setIsEditingProfile(false)
                    setProfileData({ name: user.name || '', email: user.email || '' })
                    setMessage('')
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#5CB85C' }}
                  onMouseEnter={(e) =>
                    !loading && (e.currentTarget.style.backgroundColor = '#4A9D4A')
                  }
                  onMouseLeave={(e) =>
                    !loading && (e.currentTarget.style.backgroundColor = '#5CB85C')
                  }
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditingProfile ? 'bg-gray-50' : ''
                }`}
                readOnly={!isEditingProfile}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditingProfile ? 'bg-gray-50' : ''
                }`}
                readOnly={!isEditingProfile}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <Link
              href="/preferences"
              className="px-4 py-2 text-white rounded-md transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#5CB85C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
            >
              Update Preferences
            </Link>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {user.tier?.tier_name || 'Not selected'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {user.subscription_frequency
                    ? user.subscription_frequency.charAt(0).toUpperCase() +
                      user.subscription_frequency.slice(1)
                    : 'Not selected'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meals per Week
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {user.meals_per_week || 'Not selected'}
                </div>
              </div>
            </div>
            {!user.preferences_set &&
              (user.tier ||
                user.subscription_frequency ||
                user.meals_per_week ||
                (user.allergies && user.allergies.length > 0)) && (
                <div className="pt-4">
                  <button
                    onClick={handlePreferencesUpdate}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#90EE90' }}
                    onMouseEnter={(e) =>
                      !loading && (e.currentTarget.style.backgroundColor = '#7FDD7F')
                    }
                    onMouseLeave={(e) =>
                      !loading && (e.currentTarget.style.backgroundColor = '#90EE90')
                    }
                  >
                    {loading ? 'Saving...' : 'Save Current Preferences'}
                  </button>
                </div>
              )}
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Dietary Information</h2>
            <Link
              href="/preferences"
              className="px-4 py-2 text-white rounded-md transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#5CB85C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
            >
              Update Dietary Information
            </Link>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md min-h-[40px]">
                  {user.allergies && user.allergies.length > 0
                    ? user.allergies.join(', ')
                    : 'None listed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
