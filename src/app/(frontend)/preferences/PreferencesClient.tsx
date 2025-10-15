'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Tier {
  id: string
  tier_name: string
  description: string
  weekly_price: number
  monthly_price: number
  single_price: number
}

interface DietaryRestriction {
  id: string
  name: string
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
  dietary_restrictions?: any[]
  allergies?: string[]
  preferred_pickup_time?: string
  preferences_set?: boolean
}

interface PreferencesClientProps {
  user: User
}

export default function PreferencesClient({ user }: PreferencesClientProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [tiers, setTiers] = useState<Tier[]>([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([])
  const [selectedTier, setSelectedTier] = useState<Tier | null>(user?.tier || null)
  const [selectedPlan, setSelectedPlan] = useState<string>(user?.subscription_frequency || '')
  const [selectedMeals, setSelectedMeals] = useState<number>(user?.meals_per_week || 10)
  const [includeBreakfast, setIncludeBreakfast] = useState(user?.include_breakfast || false)
  const [includeSnacks, setIncludeSnacks] = useState(user?.include_snacks || false)
  const [dietaryRestrictionsSelected, setDietaryRestrictionsSelected] = useState<string[]>(
    user?.dietary_restrictions?.map((dr: any) => dr.id || dr) || [],
  )
  const [allergies, setAllergies] = useState<string[]>(user?.allergies || [])
  const [preferredPickupTime, setPreferredPickupTime] = useState(user?.preferred_pickup_time || '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const totalSteps = 6

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
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

    // Fetch dietary restrictions
    fetch('/api/dietary-restrictions')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.docs) {
          setDietaryRestrictions(data.docs)
        } else {
          // Mock data for development
          setDietaryRestrictions([
            { id: '1', name: 'Vegetarian' },
            { id: '2', name: 'Vegan' },
            { id: '3', name: 'Gluten-Free' },
            { id: '4', name: 'Dairy-Free' },
            { id: '5', name: 'Keto' },
          ])
        }
      })
      .catch((err) => {
        console.error('Error fetching dietary restrictions:', err)
        // Mock data for development
        setDietaryRestrictions([
          { id: '1', name: 'Vegetarian' },
          { id: '2', name: 'Vegan' },
          { id: '3', name: 'Gluten-Free' },
          { id: '4', name: 'Dairy-Free' },
          { id: '5', name: 'Keto' },
        ])
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
        return 'Want to add breakfast or snacks?'
      case 5:
        return 'Complete your preferences'
      case 6:
        return 'Review your plan'
      default:
        return 'Update Preferences'
    }
  }

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Choose the tier that matches your nutritional needs. Not sure which tier is right for you? We highly recommend calling us at (956) 424-2247 or stopping by our office so Peggy, our registered dietitian, can help determine the best tier for your specific goals and needs.'
      case 2:
        return "Choose how often you'd like to receive your meals."
      case 3:
        return "Select the number of meals you'd like per week."
      case 4:
        return 'Add breakfast and snacks to your subscription for an additional cost.'
      case 5:
        return 'Tell us about your dietary preferences and restrictions.'
      case 6:
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

  const handleDietaryRestrictionToggle = (restrictionId: string) => {
    setDietaryRestrictionsSelected((prev) =>
      prev.includes(restrictionId)
        ? prev.filter((id) => id !== restrictionId)
        : [...prev, restrictionId],
    )
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
        include_breakfast: includeBreakfast,
        include_snacks: includeSnacks,
        dietary_restrictions: dietaryRestrictionsSelected,
        allergies,
        preferred_pickup_time: preferredPickupTime,
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
          include_breakfast: includeBreakfast,
          include_snacks: includeSnacks,
          dietary_restrictions: dietaryRestrictionsSelected,
          allergies,
          preferred_pickup_time: preferredPickupTime,
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
      alert(`Failed to save preferences: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/images/brand/logo.png" alt="Meal PREPS Logo" className="h-12 w-auto" />
            </div>
            <nav className="flex items-center space-x-6">
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  <span>{user?.name || 'User'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/account-settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/preferences"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Manage Preferences
                    </Link>
                    <Link
                      href="/order-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Order History
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
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
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center relative ${
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
                  <div className="text-2xl font-bold text-gray-900">{meals}</div>
                  <div className="text-sm text-gray-600">meals per week</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Add-ons */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div
                onClick={() => setIncludeBreakfast(!includeBreakfast)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  includeBreakfast
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Breakfast</h3>
                    <p className="text-gray-600">Add breakfast to your meal plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">+$15/week</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setIncludeSnacks(!includeSnacks)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  includeSnacks
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Snacks</h3>
                    <p className="text-gray-600">Add healthy snacks to your meal plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">+$10/week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Dietary Preferences */}
        {currentStep === 5 && (
          <div className="space-y-8">
            {/* Dietary Restrictions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryRestrictions.map((restriction) => (
                  <button
                    key={restriction.id}
                    onClick={() => handleDietaryRestrictionToggle(restriction.id)}
                    className={`p-3 text-left border rounded-lg transition-all ${
                      dietaryRestrictionsSelected.includes(restriction.id)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {restriction.name}
                  </button>
                ))}
              </div>
            </div>

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

            {/* Preferred Pickup Time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Pickup Time</h3>
              <select
                value={preferredPickupTime}
                onChange={(e) => setPreferredPickupTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select pickup time</option>
                <option value="sunday-3pm-6pm">Sunday 3pm-6pm</option>
                <option value="monday-10am-6pm">Monday 10am-6pm</option>
                <option value="wednesday-3pm-6pm">Wednesday 3pm-6pm</option>
                <option value="thursday-10am-6pm">Thursday 10am-6pm</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 6: Review Plan */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tier:</span>
                  <span className="font-semibold">{selectedTier?.tier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meals per week:</span>
                  <span className="font-semibold">{selectedMeals}</span>
                </div>
                {includeBreakfast && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breakfast:</span>
                    <span className="font-semibold text-emerald-600">+$15/week</span>
                  </div>
                )}
                {includeSnacks && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Snacks:</span>
                    <span className="font-semibold text-emerald-600">+$10/week</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup time:</span>
                  <span className="font-semibold">{preferredPickupTime || 'Not selected'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg
              className="w-4 h-4 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            disabled={currentStep === 1 && !selectedTier}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
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
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
