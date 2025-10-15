'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthenticatedHeader from '../components/AuthenticatedHeader'
import type { Customer } from '@/payload-types'

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

interface OrderNowClientProps {
  isNewUser: boolean
  user?: Customer
  userPreferences?: {
    tier?: Tier
    subscription_frequency?: string
    meals_per_week?: number
    include_breakfast?: boolean
    include_snacks?: boolean
    dietary_restrictions?: string[]
    allergies?: string[]
    preferred_pickup_time?: string
  }
}

export default function OrderNowClient({ isNewUser, user, userPreferences }: OrderNowClientProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // If user is authenticated and has preferences set, redirect to meal selection
  if (user && (user as any).preferences_set) {
    router.push('/meal-selection')
    return <div>Redirecting to meal selection...</div>
  }
  const [tiers, setTiers] = useState<Tier[]>([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([])
  const [selectedTier, setSelectedTier] = useState<Tier | null>(userPreferences?.tier || null)
  const [selectedPlan, setSelectedPlan] = useState<string>(
    userPreferences?.subscription_frequency || '',
  )
  const [selectedMeals, setSelectedMeals] = useState<number>(userPreferences?.meals_per_week || 10)
  const [includeBreakfast, setIncludeBreakfast] = useState(
    userPreferences?.include_breakfast || false,
  )
  const [includeSnacks, setIncludeSnacks] = useState(userPreferences?.include_snacks || false)
  const [dietaryRestrictionsSelected, setDietaryRestrictionsSelected] = useState<string[]>(
    userPreferences?.dietary_restrictions || [],
  )
  const [allergies, setAllergies] = useState<string[]>(userPreferences?.allergies || [])
  const [preferredPickupTime, setPreferredPickupTime] = useState(
    userPreferences?.preferred_pickup_time || '',
  )

  const totalSteps = isNewUser ? 6 : 3 // New users: 6 steps, existing users: 3 steps

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
    if (isNewUser) {
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
          return 'Add breakfast and snacks to your subscription for an additional cost.'
        case 5:
          return 'Tell us about your dietary preferences and restrictions.'
        case 6:
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
            include_breakfast: includeBreakfast || false,
            include_snacks: includeSnacks || false,
            dietary_restrictions: dietaryRestrictionsSelected || [],
            allergies: allergies || [],
            preferred_pickup_time: preferredPickupTime || null,
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
          dietaryRestrictions: dietaryRestrictionsSelected,
          allergies,
          preferredPickupTime,
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
                <Link href="/order-now" className="font-medium" style={{ color: '#5CB85C' }}>
                  Order Now
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 font-medium"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5CB85C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                >
                  Log In
                </Link>
                <Link
                  href="/create-account"
                  className="text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  style={{ backgroundColor: '#5CB85C' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
                >
                  Sign Up
                </Link>
              </nav>
            </div>
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

        {/* Step 4: Add-ons (New Users Only) */}
        {isNewUser && currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Include Breakfast</h3>
                  <p className="text-sm text-gray-600">Add breakfast items to your subscription</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-500 font-semibold">+$15/week</span>
                  <input
                    type="checkbox"
                    checked={includeBreakfast}
                    onChange={(e) => setIncludeBreakfast(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Include Snacks</h3>
                  <p className="text-sm text-gray-600">Add healthy snacks to your subscription</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-500 font-semibold">+$10/week</span>
                  <input
                    type="checkbox"
                    checked={includeSnacks}
                    onChange={(e) => setIncludeSnacks(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Preferences (New Users Only) */}
        {isNewUser && currentStep === 5 && (
          <div className="space-y-8">
            {/* Dietary Restrictions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dietary Restrictions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryRestrictions.map((restriction) => (
                  <button
                    key={restriction.id}
                    onClick={() => handleDietaryRestrictionToggle(restriction.id)}
                    className={`p-3 border rounded-lg text-sm transition-all ${
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
              <h3 className="text-lg font-semibold mb-4">Allergies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Nuts', 'Dairy', 'Eggs', 'Soy', 'Shellfish', 'Gluten'].map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => handleAllergyToggle(allergy)}
                    className={`p-3 border rounded-lg text-sm transition-all ${
                      allergies.includes(allergy)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
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
              <h3 className="text-lg font-semibold mb-4">Preferred Pickup Time</h3>
              <select
                value={preferredPickupTime}
                onChange={(e) => setPreferredPickupTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select pickup time</option>
                <option value="morning">Morning (8:00 AM - 10:00 AM)</option>
                <option value="afternoon">Afternoon (12:00 PM - 2:00 PM)</option>
                <option value="evening">Evening (4:00 PM - 6:00 PM)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 6: Review Plan (New Users Only) */}
        {isNewUser && currentStep === 6 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Your Subscription Plan</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tier:</span>
                  <span className="font-semibold">{selectedTier?.tier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-semibold capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Meals per week:</span>
                  <span className="font-semibold">{selectedMeals}</span>
                </div>
                {includeBreakfast && (
                  <div className="flex justify-between text-orange-600">
                    <span>Breakfast:</span>
                    <span className="font-semibold">+$15/week</span>
                  </div>
                )}
                {includeSnacks && (
                  <div className="flex justify-between text-orange-600">
                    <span>Snacks:</span>
                    <span className="font-semibold">+$10/week</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>
                      $
                      {selectedPlan === 'weekly'
                        ? (selectedTier?.weekly_price || 0) +
                          (includeBreakfast ? 15 : 0) +
                          (includeSnacks ? 10 : 0)
                        : (selectedTier?.monthly_price || 0) +
                          (includeBreakfast ? 60 : 0) +
                          (includeSnacks ? 40 : 0)}
                      /{selectedPlan === 'weekly' ? 'week' : 'month'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Preferences Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>
                  Dietary Restrictions:{' '}
                  {dietaryRestrictionsSelected.length > 0
                    ? dietaryRestrictionsSelected.join(', ')
                    : 'None'}
                </div>
                <div>Allergies: {allergies.length > 0 ? allergies.join(', ') : 'None'}</div>
                <div>Pickup Time: {preferredPickupTime || 'Not selected'}</div>
              </div>
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
                <div>Breakfast: {includeBreakfast ? 'Yes' : 'No'}</div>
                <div>Snacks: {includeSnacks ? 'Yes' : 'No'}</div>
                <div>
                  Dietary Restrictions:{' '}
                  {dietaryRestrictionsSelected.length > 0
                    ? dietaryRestrictionsSelected.join(', ')
                    : 'None'}
                </div>
                <div>Allergies: {allergies.length > 0 ? allergies.join(', ') : 'None'}</div>
                <div>Pickup Time: {preferredPickupTime || 'Not set'}</div>
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
