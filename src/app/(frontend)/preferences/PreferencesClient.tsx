'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Tier {
  id: string
  tier_name: string
  description: string
  weekly_price: number
  monthly_price: number
  single_price: number
}

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

interface PreferencesClientProps {
  user: User
}

export default function PreferencesClient({ user }: PreferencesClientProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tiers, setTiers] = useState<Tier[]>([])
  const [selectedTier, setSelectedTier] = useState<Tier | null>(user?.tier || null)
  const [selectedPlan, setSelectedPlan] = useState<string>(user?.subscription_frequency || '')
  const [selectedMeals, setSelectedMeals] = useState<number>(user?.meals_per_week || 10)
  const [includeSnacks, _setIncludeSnacks] = useState(user?.include_snacks || false)
  const [allergies, setAllergies] = useState<string[]>(user?.allergies || [])
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  const totalSteps = 5

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

  useEffect(() => {
    // Fetch tiers
    fetch('/api/tiers')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.docs) {
          setTiers(data.docs)
        } else {
          console.log('No tiers found in database')
          setTiers([])
        }
      })
      .catch((err) => {
        console.error('Error fetching tiers:', err)
        setTiers([])
      })
  }, [])

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "What's your calorie goal?"
      case 2:
        return 'How often do you want to subscribe?'
      case 3:
        return 'How many meals per week?'
      case 4:
        return 'Complete your preferences'
      case 5:
        return 'Review your plan'
      default:
        return 'Update Preferences'
    }
  }

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Choose the tier that matches your nutritional needs.'
      case 2:
        return "Choose how often you'd like to receive your meals."
      case 3:
        return "Select the number of meals you'd like per week."
      case 4:
        return 'Tell us about your allergies and dietary preferences.'
      case 5:
        return 'Review your subscription details before proceeding.'
      default:
        return ''
    }
  }

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier)
  }

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan)
  }

  const handleMealsSelect = (meals: number) => {
    setSelectedMeals(meals)
  }

  const handleAllergyToggle = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy],
    )
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log('Saving preferences:', {
        tier: selectedTier,
        subscription_frequency: selectedPlan,
        meals_per_week: selectedMeals,
        include_breakfast: false,
        include_snacks: includeSnacks,
        allergies,
      })

      // Save preferences to the database
      const response = await fetch('/api/customers/update-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier?.id,
          subscription_frequency: selectedPlan,
          meals_per_week: selectedMeals,
          include_breakfast: false,
          include_snacks: includeSnacks,
          allergies,
          preferences_set: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save preferences')
      }

      // Redirect to success page
      router.push('/preferences-success')
    } catch (error: any) {
      console.error('Error saving preferences:', error)
      alert(`Failed to save preferences: ${error.message}`)
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
                  width={150}
                  height={48}
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDesktopDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/preferences"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors bg-gray-50"
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/preferences"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors bg-gray-50"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                  style={{
                    backgroundColor: i + 1 <= currentStep ? '#5CB85C' : '#D1D5DB',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{getStepTitle()}</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">{getStepSubtitle()}</p>
        </div>

        {/* Step 1: Tier Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Contact Info Box */}
            <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 mb-8">
              <p className="text-sm text-blue-800 text-center">
                Not sure which tier is right for you? We highly recommend calling us at{' '}
                <span className="font-bold text-blue-900">(956) 424-2247</span> or stopping by our
                office so Peggy, our registered dietitian, can help determine the best tier for your
                specific goals and needs.
              </p>
            </div>

            {/* Calorie Tier Cards */}
            <div className="grid grid-cols-2 gap-6">
              {tiers.length > 0 ? (
                tiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier)}
                    className={`p-8 border-2 rounded-lg cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                      selectedTier?.id === tier.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl font-semibold text-gray-900 mb-3">{tier.tier_name}</div>
                    <div className="text-xl font-bold text-emerald-600">{tier.description}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 text-lg">Loading tiers...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Subscription Frequency */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div
                onClick={() => handlePlanSelect('weekly')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  selectedPlan === 'weekly'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Weekly</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-2">
                  ${selectedTier?.weekly_price || 0}
                </p>
                <p className="text-gray-600">per week</p>
              </div>
              <div
                onClick={() => handlePlanSelect('monthly')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  selectedPlan === 'monthly'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-2">
                  ${selectedTier?.monthly_price || 0}
                </p>
                <p className="text-gray-600">per month</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Meals per Week */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[5, 10, 12, 15].map((meals) => (
                <div
                  key={meals}
                  onClick={() => handleMealsSelect(meals)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all text-center relative ${
                    selectedMeals === meals
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {meals === 10 && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span
                        className="px-2 py-1 text-xs font-semibold text-white rounded"
                        style={{ backgroundColor: '#F7931E' }}
                      >
                        Popular
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-gray-900">{meals}</div>
                  <div className="text-base text-gray-600">meals per week</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Dietary Preferences */}
        {currentStep === 4 && (
          <div className="space-y-8">
            {/* Allergies */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy', 'Eggs'].map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => handleAllergyToggle(allergy)}
                    className={`p-3 text-left border rounded-lg transition-all ${
                      allergies.includes(allergy)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review Plan */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div
              className="p-6 border"
              style={{
                background:
                  'linear-gradient(135deg, rgba(92, 184, 92, 0.08) 0%, rgba(247, 147, 30, 0.12) 25%, rgba(92, 184, 92, 0.15) 50%, rgba(247, 147, 30, 0.1) 75%, rgba(92, 184, 92, 0.08) 100%), linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                borderColor: 'rgba(92, 184, 92, 0.2)',
                borderWidth: '2px',
                borderRadius: '16px',
                boxSizing: 'border-box',
              }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Plan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-3">
                  <span className="text-gray-600">Tier:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTier?.tier_name || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-3">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedPlan === 'weekly'
                      ? 'Weekly'
                      : selectedPlan === 'monthly'
                        ? 'Monthly'
                        : selectedPlan || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-3">
                  <span className="text-gray-600">Meals per week:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedMeals || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allergens:</span>
                  <span className="font-semibold text-gray-900">
                    {allergies.length > 0 ? allergies.join(', ') : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          {currentStep === 1 ? (
            <Link
              href="/"
              className="px-6 py-3 rounded-lg font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          ) : (
            <button
              onClick={prevStep}
              className="px-6 py-3 rounded-lg font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
          <button
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={currentStep === 1 && !selectedTier}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
              currentStep === 1 && !selectedTier
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'text-white'
            }`}
            style={{
              backgroundColor: currentStep === 1 && !selectedTier ? '#F3F4F6' : '#5CB85C',
            }}
            onMouseEnter={(e) => {
              if (!(currentStep === 1 && !selectedTier)) {
                e.currentTarget.style.backgroundColor = '#4A9D4A'
              }
            }}
            onMouseLeave={(e) => {
              if (!(currentStep === 1 && !selectedTier)) {
                e.currentTarget.style.backgroundColor = '#5CB85C'
              }
            }}
          >
            {currentStep === totalSteps ? 'Update Preferences' : 'Next'}
            <svg
              className="w-4 h-4 ml-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
