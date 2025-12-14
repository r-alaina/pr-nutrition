'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MenuItem, Customer } from '@/payload-types'
import AuthenticatedHeader from '../components/AuthenticatedHeader'
import {
  calculateTotalAllergenCharges,
  hasAllergenConflict,
  getMatchingAllergens,
} from '@/utilities/allergenCharges'

interface MealSelectionClientProps {
  groupedFirstHalf: Record<string, MenuItem[]>
  groupedSecondHalf: Record<string, MenuItem[]>
  categoryOrder: Array<{ key: string; label: string }>
  user: Customer
}

export default function MealSelectionClient({
  groupedFirstHalf,
  groupedSecondHalf,
  categoryOrder,
  user,
}: MealSelectionClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'firstHalf' | 'secondHalf'>('firstHalf')
  const [selectedFirstHalfMeals, setSelectedFirstHalfMeals] = useState<
    { meal: MenuItem; quantity: number }[]
  >([])
  const [selectedSecondHalfMeals, setSelectedSecondHalfMeals] = useState<
    { meal: MenuItem; quantity: number }[]
  >([])
  const mealsPerWeek = user.meals_per_week || 10

  // Combine meals for allergen calculation
  const selectedMeals = [...selectedFirstHalfMeals, ...selectedSecondHalfMeals]

  // Separate meals from snacks

  const selectedSnacks = selectedMeals.filter((item) => item.meal.category === 'snack')

  // Calculate allergen charges for display
  const allergenCharges = calculateTotalAllergenCharges(selectedMeals, user.allergies || [])

  const handleMealToggle = (meal: MenuItem, half: 'firstHalf' | 'secondHalf') => {
    const setter = half === 'firstHalf' ? setSelectedFirstHalfMeals : setSelectedSecondHalfMeals


    setter((prev) => {
      const existingIndex = prev.findIndex((item) => item.meal.id === meal.id)

      if (existingIndex >= 0) {
        // Remove meal
        return prev.filter((item) => item.meal.id !== meal.id)
      } else {
        // Snacks don't count toward meal limit
        if (meal.category === 'snack') {
          return [...prev, { meal, quantity: 1 }]
        }
        // Add meal if under total limit (across both halves)
        const currentMealTotal = prev
          .filter((item) => item.meal.category !== 'snack')
          .reduce((total, item) => total + item.quantity, 0)

        // Get the total from the other half
        const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals
        const otherHalfTotal = otherHalf
          .filter((item) => item.meal.category !== 'snack')
          .reduce((total, item) => total + item.quantity, 0)

        // Total meals across both halves cannot exceed mealsPerWeek
        if (currentMealTotal + otherHalfTotal < mealsPerWeek) {
          return [...prev, { meal, quantity: 1 }]
        }
        return prev
      }
    })
  }

  const handleQuantityChange = (
    mealId: number,
    quantity: number,
    half: 'firstHalf' | 'secondHalf',
  ) => {
    const setter = half === 'firstHalf' ? setSelectedFirstHalfMeals : setSelectedSecondHalfMeals
    const currentMeals = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals

    if (quantity <= 0) {
      // Remove meal if quantity is 0 or negative
      setter((prev) => prev.filter((item) => item.meal.id !== mealId))
      return
    }

    const meal = currentMeals.find((item) => item.meal.id === mealId)?.meal
    if (!meal) return

    // Snacks don't count toward meal limit
    if (meal.category === 'snack') {
      setter((prev) => prev.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)))
      return
    }

    // For meals, check against total limit across both halves
    const currentMealTotal = currentMeals
      .filter((item) => item.meal.category !== 'snack')
      .reduce((total, item) => total + item.quantity, 0)
    const currentMealQuantity = currentMeals.find((item) => item.meal.id === mealId)?.quantity || 0

    // Get the total from the other half
    const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals
    const otherHalfTotal = otherHalf
      .filter((item) => item.meal.category !== 'snack')
      .reduce((total, item) => total + item.quantity, 0)

    // Calculate new total across both halves
    const newCurrentHalfTotal = currentMealTotal - currentMealQuantity + quantity
    const newTotal = newCurrentHalfTotal + otherHalfTotal

    if (newTotal <= mealsPerWeek) {
      setter((prev) => prev.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)))
    }
  }

  const isMealSelected = (meal: MenuItem, half: 'firstHalf' | 'secondHalf') => {
    const currentMeals = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals
    return currentMeals.some((selected) => selected.meal.id === meal.id)
  }

  const getMealQuantity = (meal: MenuItem, half: 'firstHalf' | 'secondHalf') => {
    const currentMeals = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals
    const selected = currentMeals.find((item) => item.meal.id === meal.id)
    return selected ? selected.quantity : 0
  }

  const getTotalSelectedMeals = (half?: 'firstHalf' | 'secondHalf') => {
    if (half === 'firstHalf') {
      return selectedFirstHalfMeals
        .filter((item) => item.meal.category !== 'snack')
        .reduce((total, item) => total + item.quantity, 0)
    }
    if (half === 'secondHalf') {
      return selectedSecondHalfMeals
        .filter((item) => item.meal.category !== 'snack')
        .reduce((total, item) => total + item.quantity, 0)
    }
    return (
      selectedFirstHalfMeals
        .filter((item) => item.meal.category !== 'snack')
        .reduce((total, item) => total + item.quantity, 0) +
      selectedSecondHalfMeals
        .filter((item) => item.meal.category !== 'snack')
        .reduce((total, item) => total + item.quantity, 0)
    )
  }

  const getTotalSelectedSnacks = () => {
    return selectedSnacks.reduce((total, item) => total + item.quantity, 0)
  }

  // Total meals across both halves cannot exceed mealsPerWeek
  const totalSelectedMeals = getTotalSelectedMeals()
  const canSelectMoreTotal = totalSelectedMeals < mealsPerWeek

  // For the current tab, check if we can add more meals (respecting total limit)
  const currentTabTotal = getTotalSelectedMeals(activeTab)
  const currentCanSelectMore = canSelectMoreTotal && currentTabTotal < mealsPerWeek

  // Calculate snack total price
  const snackTotal = selectedSnacks.reduce((total, item) => {
    return total + (item.meal.price || 0) * item.quantity
  }, 0)

  // Get current grouped items based on active tab
  const groupedItems = activeTab === 'firstHalf' ? groupedFirstHalf : groupedSecondHalf

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AuthenticatedHeader user={user} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Selection Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Meals</h1>
          <p className="text-xl text-gray-600 mb-6">
            Select up to {mealsPerWeek} meals total (split between first and second half) for your{' '}
            {user.subscription_frequency} plan
          </p>

          {/* Tabs for First Half / Second Half */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setActiveTab('firstHalf')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'firstHalf'
                    ? 'bg-[#5CB85C] text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                First Half Menu
                <span className="block text-xs mt-1">Sunday & Monday Pickup</span>
              </button>
              <button
                onClick={() => setActiveTab('secondHalf')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'secondHalf'
                    ? 'bg-[#5CB85C] text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Second Half Menu
                <span className="block text-xs mt-1">Wednesday & Thursday Pickup</span>
              </button>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-2xl mx-auto mb-6">
            <div className="mb-3">
              <p className="text-sm text-emerald-700 font-medium mb-1">Total Meals Selected</p>
              <p className="text-emerald-800 font-semibold text-lg">
                {totalSelectedMeals} of {mealsPerWeek} meals
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-emerald-200 pt-3">
              <div>
                <p className="text-sm text-emerald-700 font-medium mb-1">First Half</p>
                <p className="text-emerald-800 font-semibold">
                  {getTotalSelectedMeals('firstHalf')} meals
                </p>
              </div>
              <div>
                <p className="text-sm text-emerald-700 font-medium mb-1">Second Half</p>
                <p className="text-emerald-800 font-semibold">
                  {getTotalSelectedMeals('secondHalf')} meals
                </p>
              </div>
            </div>
            {getTotalSelectedSnacks() > 0 && (
              <p className="text-emerald-700 text-sm mt-3 text-center border-t border-emerald-200 pt-3">
                {getTotalSelectedSnacks()} snack(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Menu Categories */}
        {categoryOrder.map(({ key, label }) => {
          const items = groupedItems[key] || []
          if (items.length === 0) return null

          return (
            <div key={key} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{label}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const isSelected = isMealSelected(item, activeTab)
                  const canSelect = currentCanSelectMore || isSelected

                  return (
                    <div
                      key={item.id}
                      onClick={() => canSelect && handleMealToggle(item, activeTab)}
                      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : canSelect
                            ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                            : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                          {item.category === 'premium' && (
                            <span
                              className="text-white text-xs font-semibold px-2 py-1 rounded"
                              style={{ backgroundColor: '#F7931E' }}
                            >
                              Premium
                            </span>
                          )}
                          {isSelected && (
                            <div className="text-emerald-600">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>

                        {/* Allergens */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Allergens:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.allergens.map((allergen, index) => {
                                const isUserAllergic = user.allergies?.includes(
                                  allergen.allergen || '',
                                )
                                return (
                                  <span
                                    key={index}
                                    className={`text-xs px-2 py-1 rounded ${
                                      isUserAllergic
                                        ? 'bg-red-100 text-red-800 border border-red-300 font-medium'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {allergen.allergen}
                                  </span>
                                )
                              })}
                            </div>
                            {hasAllergenConflict(item, user.allergies || []) && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-xs text-yellow-800 font-medium">
                                  Contains {getMatchingAllergens(item, user.allergies || []).length}{' '}
                                  allergen(s) you&apos;re sensitive to
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Additional $
                                  {(
                                    getMatchingAllergens(item, user.allergies || []).length * 5
                                  ).toFixed(2)}{' '}
                                  charge per meal
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-500">Included in your plan</div>
                            <div className="text-lg font-semibold" style={{ color: '#5CB85C' }}>
                              {user.subscription_frequency === 'weekly'
                                ? 'Weekly Plan'
                                : user.subscription_frequency === 'monthly'
                                  ? 'Monthly Plan'
                                  : 'Plan'}
                            </div>
                          </div>

                          {isSelected ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const currentQuantity = getMealQuantity(item, activeTab)
                                  handleQuantityChange(item.id, currentQuantity - 1, activeTab)
                                }}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                              >
                                -
                              </button>
                              <span className="text-lg font-semibold text-emerald-600 min-w-[2rem] text-center">
                                {getMealQuantity(item, activeTab)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const currentQuantity = getMealQuantity(item, activeTab)
                                  if (totalSelectedMeals < mealsPerWeek) {
                                    handleQuantityChange(item.id, currentQuantity + 1, activeTab)
                                  }
                                }}
                                disabled={totalSelectedMeals >= mealsPerWeek}
                                className="w-8 h-8 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center text-emerald-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {canSelect ? 'Click to select' : 'Limit reached'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Pricing Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tier</p>
              <p className="font-semibold text-gray-900">
                {(typeof user.tier === 'object' && user.tier?.tier_name) || 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Frequency</p>
              <p className="font-semibold text-gray-900 capitalize">
                {user.subscription_frequency || 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Meals per Week</p>
              <p className="font-semibold text-gray-900">{mealsPerWeek}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan Price</p>
              <p className="font-semibold text-lg" style={{ color: '#5CB85C' }}>
                $
                {user.subscription_frequency === 'weekly'
                  ? (typeof user.tier === 'object' && user.tier?.weekly_price) || '0.00'
                  : user.subscription_frequency === 'monthly'
                    ? (typeof user.tier === 'object' && user.tier?.monthly_price) || '0.00'
                    : (typeof user.tier === 'object' && user.tier?.weekly_price) ||
                      (typeof user.tier === 'object' && user.tier?.monthly_price) ||
                      '0.00'}
                {user.subscription_frequency === 'weekly'
                  ? '/week'
                  : user.subscription_frequency === 'monthly'
                    ? '/month'
                    : ''}
              </p>
            </div>
          </div>

          {/* Snacks Summary */}
          {getTotalSelectedSnacks() > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Snacks (A La Carte)</p>
                  <p className="text-xs text-gray-500">{getTotalSelectedSnacks()} snack(s)</p>
                </div>
                <p className="font-semibold text-lg text-blue-600">+${snackTotal.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Allergen Charges Summary */}
          {allergenCharges > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Allergen Accommodation Charges</p>
                  <p className="text-xs text-gray-500">$5.00 per order if any allergens</p>
                </div>
                <p className="font-semibold text-lg text-orange-600">
                  +${allergenCharges.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
          <button
            onClick={async () => {
              // Check if both halves have meals or at least one half is complete
              // Check if both halves have meals or at least one half is complete

              if (selectedMeals.length === 0) {
                alert('Please select at least one meal before proceeding.')
                return
              }

              // Combine meals from both halves, tagging each with its week_half
              const mealsWithHalf = [
                ...selectedFirstHalfMeals.map((item) => ({
                  ...item,
                  weekHalf: 'firstHalf' as const,
                })),
                ...selectedSecondHalfMeals.map((item) => ({
                  ...item,
                  weekHalf: 'secondHalf' as const,
                })),
              ]

              try {
                console.log('Submitting order with meals:', mealsWithHalf)

                // Submit order to API
                const response = await fetch('/api/orders/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    selectedMeals: mealsWithHalf,
                  }),
                })

                console.log('Response status:', response.status)
                console.log('Response ok:', response.ok)

                if (!response.ok) {
                  const errorData = await response.json()
                  console.error('API error:', errorData)
                  throw new Error(errorData.message || 'Failed to submit order')
                }

                const { order } = await response.json()
                console.log('Order response received:', order)

                // Redirect to success page with order data
                const orderData = encodeURIComponent(JSON.stringify(order))
                router.push(`/order-success?order=${orderData}`)
              } catch (error) {
                console.error('Error submitting order:', error)
                const errorMessage =
                  error instanceof Error ? error.message : 'Unknown error occurred'
                alert(`Failed to submit order: ${errorMessage}`)
              }
            }}
            disabled={totalSelectedMeals === 0 || totalSelectedMeals > mealsPerWeek}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              totalSelectedMeals > 0 && totalSelectedMeals <= mealsPerWeek
                ? 'text-white hover:bg-emerald-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            style={{
              backgroundColor:
                totalSelectedMeals > 0 && totalSelectedMeals <= mealsPerWeek
                  ? '#5CB85C'
                  : undefined,
            }}
          >
            Submit Order ({totalSelectedMeals}/{mealsPerWeek})
          </button>
        </div>
      </div>
    </div>
  )
}
