// src/app/(frontend)/(account)/select-meals/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ALLERGENS } from '@/utilities/allergens'

interface Tier {
  id: string
  tier_name: string
  description?: string
  single_price: number
  calories?: string
}

export default function SelectMealsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTier, setSelectedTier] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedMeals, setSelectedMeals] = useState('')
  const [includeBreakfast, setIncludeBreakfast] = useState(false)
  const [includeSnacks, setIncludeSnacks] = useState(false)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [preferredPickupTime, setPreferredPickupTime] = useState('')
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch tiers from database
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/tiers')
        const data = await response.json()
        console.log('Tiers data:', data) // Debug log
        setTiers(data.docs || [])
      } catch (error) {
        console.error('Error fetching tiers:', error)
        console.log('No tiers found in database')
        setTiers([])
      } finally {
        setLoading(false)
      }
    }
    fetchTiers()
  }, [])

  // Debug selectedTier changes
  useEffect(() => {
    console.log('selectedTier changed to:', selectedTier)
  }, [selectedTier])

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
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
        return ''
    }
  }

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Choose the tier that matches your nutritional needs'
      case 2:
        return 'Pick the billing frequency that works for you'
      case 3:
        return 'Select the number of meals that fits your lifestyle'
      case 4:
        return 'Enhance your plan with additional options'
      case 5:
        return 'Tell us about your dietary preferences and restrictions'
      case 6:
        return "Everything looks good? Let's get started!"
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5CB85C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tiers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main content - full page layout */}
      <div className="px-6 py-12">
        {/* Header with progress dots and step counter */}
        <div className="flex items-center justify-between mb-16">
          {/* Progress Dots */}
          <div className="flex items-center space-x-3">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-12 h-3 rounded-full ${
                  step <= currentStep ? 'bg-[#5CB85C]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-2xl text-gray-600 font-medium">Step {currentStep} of 6</div>
        </div>

        {/* Main Question */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          {getStepTitle(currentStep)}
        </h1>

        <p className="text-xl text-gray-600 text-center mb-12">{getStepSubtitle(currentStep)}</p>

        {/* Info Box - Only show on Step 1 */}
        {currentStep === 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 text-center">
              Not sure which tier is right for you? We highly recommend calling us at{' '}
              <a href="tel:+19564242274" className="text-blue-600 hover:underline font-semibold">
                (956) 424-2274
              </a>{' '}
              or stopping by our office so Peggy, our registered dietitian, can help determine the
              best tier for your specific goals and needs.
            </p>
          </div>
        )}

        {/* Step 1: Tier Selection */}
        {currentStep === 1 && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => {
                  console.log('Selecting tier:', tier.id, 'Current selected:', selectedTier)
                  setSelectedTier(tier.id)
                  console.log('After setting, selectedTier will be:', tier.id)
                }}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  selectedTier === tier.id
                    ? 'border-[#5CB85C] bg-green-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900">{tier.tier_name}</h3>
                    <p className="text-xl text-[#5CB85C] font-semibold mt-1">
                      {tier.calories || 'Calorie information'}
                    </p>
                  </div>
                  {selectedTier === tier.id && (
                    <svg className="w-8 h-8 text-[#5CB85C]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Subscription Frequency - Based on Selected Tier */}
        {currentStep === 2 && selectedTier && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Get selected tier data */}
            {(() => {
              const selectedTierData = tiers.find((tier) => tier.id === selectedTier)
              if (!selectedTierData) return null

              return (
                <>
                  {/* Weekly Option */}
                  <button
                    onClick={() => setSelectedPlan('weekly')}
                    className={`w-full p-8 rounded-2xl border-2 transition-all text-left ${
                      selectedPlan === 'weekly'
                        ? 'border-[#5CB85C] bg-green-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Weekly</h3>
                        <p className="text-xl text-gray-600 mb-4">
                          Billed every week. Simple and flexible.
                        </p>
                        <div className="text-2xl font-bold text-[#5CB85C] mb-6">
                           ${(selectedTierData.single_price * 10 * 0.90).toFixed(2)}/week <span className="text-sm text-gray-500 font-normal">(est. for 10 meals)</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 text-[#5CB85C] mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-lg text-gray-700">Cancel anytime</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 text-[#5CB85C] mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-lg text-gray-700">Week-to-week flexibility</span>
                          </div>
                        </div>
                      </div>
                      {selectedPlan === 'weekly' && (
                        <svg
                          className="w-8 h-8 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Monthly Option */}
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`w-full p-8 rounded-2xl border-2 transition-all text-left ${
                      selectedPlan === 'monthly'
                        ? 'border-[#5CB85C] bg-green-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Monthly</h3>
                        <p className="text-xl text-gray-600 mb-4">
                          Billed monthly with credit allocation. Best value!
                        </p>
                        <div className="text-2xl font-bold text-[#5CB85C] mb-6">
                           ${(selectedTierData.single_price * 40 * 0.85).toFixed(2)}/month <span className="text-sm text-gray-500 font-normal">(est. for 10 meals/wk)</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 text-[#5CB85C] mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-lg text-gray-700">Save with monthly billing</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 text-[#5CB85C] mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-lg text-gray-700">1 skip allowed per month</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 text-[#5CB85C] mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-lg text-gray-700">Rollover unused credits</span>
                          </div>
                        </div>
                      </div>
                      {selectedPlan === 'monthly' && (
                        <svg
                          className="w-8 h-8 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                </>
              )
            })()}
          </div>
        )}

        {/* Step 3: Meal Quantity Selection */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* 5 meals */}
            <button
              onClick={() => setSelectedMeals('5')}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left relative ${
                selectedMeals === '5'
                  ? 'border-[#5CB85C] bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">5 meals</h3>
                  <p className="text-lg text-gray-600 mt-1">Light week</p>
                </div>
                {selectedMeals === '5' && (
                  <svg className="w-8 h-8 text-[#5CB85C]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* 10 meals - Popular */}
            <button
              onClick={() => setSelectedMeals('10')}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left relative ${
                selectedMeals === '10'
                  ? 'border-[#5CB85C] bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="absolute top-4 right-4">
                <span
                  className="text-white text-sm font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#F7931E' }}
                >
                  Popular
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">10 meals</h3>
                  <p className="text-lg text-gray-600 mt-1">Standard plan</p>
                </div>
                {selectedMeals === '10' && (
                  <svg className="w-8 h-8 text-[#5CB85C]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* 12 meals */}
            <button
              onClick={() => setSelectedMeals('12')}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left relative ${
                selectedMeals === '12'
                  ? 'border-[#5CB85C] bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">12 meals</h3>
                  <p className="text-lg text-gray-600 mt-1">Full week coverage</p>
                </div>
                {selectedMeals === '12' && (
                  <svg className="w-8 h-8 text-[#5CB85C]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* 15 meals */}
            <button
              onClick={() => setSelectedMeals('15')}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left relative ${
                selectedMeals === '15'
                  ? 'border-[#5CB85C] bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">15 meals</h3>
                  <p className="text-lg text-gray-600 mt-1">Maximum plan</p>
                </div>
                {selectedMeals === '15' && (
                  <svg className="w-8 h-8 text-[#5CB85C]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Step 4: Breakfast and Snacks Options */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Include Breakfast Option */}
            <button
              onClick={() => setIncludeBreakfast(!includeBreakfast)}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                includeBreakfast
                  ? 'border-[#5CB85C] bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${
                    includeBreakfast ? 'bg-[#5CB85C] border-[#5CB85C]' : 'bg-white border-gray-300'
                  }`}
                >
                  {includeBreakfast && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">Include Breakfast</h3>
                    <span className="text-xl font-semibold" style={{ color: '#F7931E' }}>
                      +$2.50 per meal
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">
                    Start your day right with nutritious breakfast options like overnight oats, egg
                    muffins, and protein pancakes.
                  </p>
                </div>
              </div>
            </button>

            {/* Include Snacks Option */}
            <button
              onClick={() => setIncludeSnacks(!includeSnacks)}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                includeSnacks
                  ? 'border-[#5CB85C] bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${
                    includeSnacks ? 'bg-[#5CB85C] border-[#5CB85C]' : 'bg-white border-gray-300'
                  }`}
                >
                  {includeSnacks && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">Include Snacks</h3>
                    <span className="text-xl font-semibold" style={{ color: '#F7931E' }}>
                      +$1.50 per snack
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">
                    Stay energized between meals with healthy snacks like protein bites, fruit cups,
                    and mixed nuts.
                  </p>
                </div>
              </div>
            </button>

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-8">
              <p className="text-sm text-gray-600 text-center">
                You can always add or remove these options later from your account settings.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Complete Preferences */}
        {currentStep === 5 && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Dietary Restrictions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Dietary Restrictions</h3>
              <p className="text-lg text-gray-600">
                Select any dietary restrictions that apply to you
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Vegetarian',
                  'Vegan',
                  'Gluten-Free',
                  'Lactose-Free',
                  'Keto',
                  'Paleo',
                  'Low-Carb',
                  'Low-Sodium',
                  'Nut-Free',
                ].map((restriction) => (
                  <button
                    key={restriction}
                    onClick={() => {
                      setDietaryRestrictions((prev) =>
                        prev.includes(restriction)
                          ? prev.filter((r) => r !== restriction)
                          : [...prev, restriction],
                      )
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      dietaryRestrictions.includes(restriction)
                        ? 'border-[#5CB85C] bg-green-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900">{restriction}</span>
                      {dietaryRestrictions.includes(restriction) && (
                        <svg
                          className="w-5 h-5 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Allergies</h3>
              <p className="text-lg text-gray-600">Let us know about any food allergies</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...ALLERGENS, 'None'].map((allergen) => (
                  <button
                    key={allergen}
                    onClick={() => {
                      setAllergies((prev) =>
                        prev.includes(allergen)
                          ? prev.filter((a) => a !== allergen)
                          : [...prev, allergen],
                      )
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      allergies.includes(allergen)
                        ? 'border-[#5CB85C] bg-green-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900">{allergen}</span>
                      {allergies.includes(allergen) && (
                        <svg
                          className="w-5 h-5 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Pickup Time */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Preferred Pickup Time</h3>
              <p className="text-lg text-gray-600">When would you like to pick up your meals?</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Morning (8-10 AM)', 'Afternoon (12-2 PM)', 'Evening (4-6 PM)'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setPreferredPickupTime(time)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      preferredPickupTime === time
                        ? 'border-[#5CB85C] bg-green-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900">{time}</span>
                      {preferredPickupTime === time && (
                        <svg
                          className="w-5 h-5 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div
              className="p-6"
              style={{
                borderRadius: '16px',
                border: '1.475px solid rgba(59, 130, 246, 0.2)',
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              }}
            >
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Note:</span> You can always update these preferences
                later in your account settings.
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Review Plan */}
        {currentStep === 6 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Plan Summary Box */}
            <div
              className="p-6"
              style={{
                borderRadius: '16px',
                border: '1.475px solid rgba(92, 184, 92, 0.2)',
                background:
                  'linear-gradient(135deg, rgba(92, 184, 92, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%)',
              }}
            >
              <div className="space-y-4">
                {/* Tier */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Tier:</span>
                  <span className="text-lg text-gray-900">
                    {(() => {
                      const selectedTierData = tiers.find((tier) => tier.id === selectedTier)
                      return selectedTierData
                        ? `${selectedTierData.tier_name} (${selectedTierData.calories || 'calorie info'})`
                        : 'Not selected'
                    })()}
                  </span>
                </div>

                {/* Frequency */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Frequency:</span>
                  <span className="text-lg text-gray-900 capitalize">
                    {selectedPlan || 'Not selected'}
                  </span>
                </div>

                {/* Meals per week */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Meals per week:</span>
                  <span className="text-lg text-gray-900">
                    {selectedMeals || 'Not selected'} meals
                  </span>
                </div>

                {/* Breakfast add-on */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Breakfast add-on:</span>
                  <div className="flex items-center">
                    {includeBreakfast ? (
                      <>
                        <span className="text-lg text-gray-900 mr-2">Included</span>
                        <svg
                          className="w-5 h-5 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    ) : (
                      <span className="text-lg text-gray-500">Not included</span>
                    )}
                  </div>
                </div>

                {/* Snacks add-on */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Snacks add-on:</span>
                  <div className="flex items-center">
                    {includeSnacks ? (
                      <>
                        <span className="text-lg text-gray-900 mr-2">Included</span>
                        <svg
                          className="w-5 h-5 text-[#5CB85C]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    ) : (
                      <span className="text-lg text-gray-500">Not included</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Information Box */}
            <div
              className="p-6"
              style={{
                borderRadius: '16px',
                border: '1.475px solid rgba(59, 130, 246, 0.2)',
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              }}
            >
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Next step:</span> Set up your account, add dietary
                preferences, and choose your first meals!
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-16 max-w-4xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-8 py-4 rounded-lg text-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={
              currentStep === 1
                ? !selectedTier
                : currentStep === 2
                  ? !selectedPlan
                  : currentStep === 3
                    ? !selectedMeals
                    : false
            }
            className={`px-8 py-4 rounded-lg text-lg font-medium transition-colors ${
              (
                currentStep === 1
                  ? !selectedTier
                  : currentStep === 2
                    ? !selectedPlan
                    : currentStep === 3
                      ? !selectedMeals
                      : false
              )
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#5CB85C] text-white hover:bg-[#4A9A4A]'
            }`}
          >
            {currentStep === 6 ? 'Complete' : 'Next'}
            {currentStep === 1 && !selectedTier && '(Select a tier first)'}
            {currentStep === 2 && !selectedPlan && '(Select a plan first)'}
            {currentStep === 3 && !selectedMeals && '(Select meals first)'}
          </button>
        </div>
      </div>
    </div>
  )
}
