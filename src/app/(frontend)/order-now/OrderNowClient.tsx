'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AuthenticatedHeader from '../components/AuthenticatedHeader'
import { ALLERGENS, toCanonicalAllergen } from '@/utilities/allergens'
import type { Customer, Tier } from '@/payload-types'

interface OrderNowClientProps {
  isNewUser: boolean
  user?: Customer
  userPreferences?: {
    tier?: Tier | number | null
    subscription_frequency?: string
    meals_per_week?: number
    include_breakfast?: boolean
    include_snacks?: boolean
    allergies?: string[]
  }
}

export default function OrderNowClient({ isNewUser, user, userPreferences }: OrderNowClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(1)
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

  const [tiers, setTiers] = useState<Tier[]>([])
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [selectedTier, setSelectedTier] = useState<Tier | null>(
    userPreferences?.tier && typeof userPreferences.tier === 'object' ? userPreferences.tier : null,
  )
  const [selectedPlan, setSelectedPlan] = useState<string>(
    userPreferences?.subscription_frequency || '',
  )
  const [selectedMeals, setSelectedMeals] = useState<number>(userPreferences?.meals_per_week || 10)
  const [includeBreakfast, _setIncludeBreakfast] = useState(
    userPreferences?.include_breakfast || false,
  )

  const [includeSnacks, _setIncludeSnacks] = useState(userPreferences?.include_snacks || false)
  const [allergies, setAllergies] = useState<string[]>(
    (userPreferences?.allergies || []).map(toCanonicalAllergen)
  )

  const totalSteps = isNewUser ? 5 : 3 // New users: 5 steps (preferences step added back after removing breakfast), existing users: 3 steps

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
    if (isNewUser) {
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
          return 'Order Now'
      }
    } else {
      switch (currentStep) {
        case 1:
          return 'Select your meals for this week'
        case 2:
          return 'Review your order'
        case 3:
          return 'Confirm and submit'
        default:
          return 'Order Now'
      }
    }
  }

  const getStepSubtitle = () => {
    if (isNewUser) {
      switch (currentStep) {
        case 1:
          return 'Choose the tier that matches your nutritional needs. Not sure which tier is right for you? We highly recommend calling us at (956) 424-2247 or stopping by our office so Peggy, our registered dietitian, can help determine the best tier for your specific goals and needs.'
        case 2:
          return "Choose how often you'd like to receive your meals."
        case 3:
          return "Select the number of meals you'd like per week."
        case 4:
          return 'Tell us about your dietary preferences and restrictions.'
        case 5:
          return 'Review your subscription details before proceeding.'
        default:
          return ''
      }
    } else {
      switch (currentStep) {
        case 1:
          return 'Choose your meals from our current menu.'
        case 2:
          return 'Review your selected meals and preferences.'
        case 3:
          return 'Confirm your order and submit.'
        default:
          return ''
      }
    }
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

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier)
    console.log('Selected tier:', tier)
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

  const handleSubmit = async () => {
    if (isNewUser) {
      // Save preferences and proceed to checkout
      try {
        const response = await fetch('/api/customers/update-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tier: selectedTier?.id || null,
            subscription_frequency: selectedPlan || null,
            meals_per_week: selectedMeals || null,
            include_breakfast: false,
            include_snacks: includeSnacks || false,
            allergies: allergies || [],
            preferences_set: true,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to save preferences')
        }

        // Redirect to success page
        router.push('/preferences-success')
      } catch (error) {
        console.error('Error saving preferences:', error)
        alert('Failed to save preferences. Please try again.')
      }
    } else {
      // Submit order
      console.log('Submitting order:', {
        selectedMeals,
        preferences: {
          tier: selectedTier,
          plan: selectedPlan,
          includeBreakfast,
          includeSnacks,
          allergies,
        },
      })
      // TODO: Submit order to backend
      router.push('/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

        {/* Step 1: Tier Selection (New Users Only) */}
        {isNewUser && currentStep === 1 && (
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
                    className={`p-8 border-2 rounded-lg cursor-pointer transition-all text-center relative ${
                      selectedTier?.id === tier.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedTier?.id === tier.id && (
                      <div className="absolute top-3 right-3">
                        <svg
                          className="w-6 h-6 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="text-xl font-semibold text-gray-900 mb-3">{tier.tier_name}</div>
                    <div className="text-xl font-bold text-emerald-600">{tier.description}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {tiers.length === 0
                      ? 'No tiers available. Please contact support.'
                      : 'Loading tiers...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Plan Selection (New Users Only) */}
        {isNewUser && currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div
                onClick={() => handlePlanSelect('weekly')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'weekly'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">Weekly</h3>
                <p className="text-gray-600 mb-4">Perfect for trying out our service</p>
                <div className="text-2xl font-bold text-emerald-600">
                  ${selectedTier?.weekly_price}/week
                </div>
              </div>
              <div
                onClick={() => handlePlanSelect('monthly')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">Monthly</h3>
                <p className="text-gray-600 mb-4">Best value for regular customers</p>
                <div className="text-2xl font-bold text-emerald-600">
                  ${selectedTier?.monthly_price}/month
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Meals Per Week (New Users Only) */}
        {isNewUser && currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  <div className="text-2xl font-bold text-gray-900">{meals}</div>
                  <div className="text-sm text-gray-600">meals per week</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Preferences (New Users Only) */}
        {isNewUser && currentStep === 4 && (
          <div className="space-y-8">
            {/* Allergies */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Allergies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ALLERGENS.map((allergen) => (
                  <button
                    key={allergen}
                    onClick={() => handleAllergyToggle(allergen)}
                    className={`p-3 border rounded-lg text-sm transition-all ${
                      allergies.includes(allergen)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review Plan (New Users Only) */}
        {isNewUser && currentStep === 5 && (
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
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Subscription Plan</h3>
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

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                When completing, your account will be set up and able to choose meals!
              </p>
            </div>
          </div>
        )}

        {/* Meal Selection (Existing Users) */}
        {!isNewUser && currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Your Current Preferences</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Tier: {selectedTier?.tier_name || 'Not set'}</div>
                <div>Frequency: {selectedPlan || 'Not set'}</div>
                <div>Meals per week: {selectedMeals}</div>
                <div>Snacks: {includeSnacks ? 'Yes' : 'No'}</div>
                <div>Allergies: {allergies.length > 0 ? allergies.join(', ') : 'None'}</div>
              </div>
              <Link
                href="/account-settings"
                className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
              >
                Update preferences
              </Link>
            </div>
            <p className="text-gray-600">Meal selection interface will go here...</p>
            {/* TODO: Implement meal selection interface */}
          </div>
        )}

        {/* Order Review (Existing Users) */}
        {!isNewUser && currentStep === 2 && (
          <div className="space-y-6">
            <p className="text-gray-600">Order review interface will go here...</p>
            {/* TODO: Implement order review interface */}
          </div>
        )}

        {/* Order Confirmation (Existing Users) */}
        {!isNewUser && currentStep === 3 && (
          <div className="space-y-6">
            <p className="text-gray-600">Order confirmation interface will go here...</p>
            {/* TODO: Implement order confirmation interface */}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
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
          <button
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={
              (isNewUser && currentStep === 1 && !selectedTier) ||
              (isNewUser && currentStep === 2 && !selectedPlan) ||
              (isNewUser && currentStep === 3 && !selectedMeals)
            }
            className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
