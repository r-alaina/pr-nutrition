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
  groupedItems: Record<string, MenuItem[]>
  categoryOrder: Array<{ key: string; label: string }>
  user: Customer
}

export default function MealSelectionClient({
  groupedItems,
  categoryOrder,
  user,
}: MealSelectionClientProps) {
  const router = useRouter()
  const [selectedMeals, setSelectedMeals] = useState<{ meal: MenuItem; quantity: number }[]>([])
  const mealsPerWeek = user.meals_per_week || 10

  // Calculate allergen charges for display
  const allergenCharges = calculateTotalAllergenCharges(selectedMeals, user.allergies || [])

  // Get the meal price (temporarily using single price field)
  const getMealPrice = (meal: MenuItem) => {
    return meal.price || 0
  }

  const handleMealToggle = (meal: MenuItem) => {
    setSelectedMeals((prev) => {
      const existingIndex = prev.findIndex((item) => item.meal.id === meal.id)

      if (existingIndex >= 0) {
        // Remove meal
        return prev.filter((item) => item.meal.id !== meal.id)
      } else {
        // Add meal if under limit
        if (prev.reduce((total, item) => total + item.quantity, 0) < mealsPerWeek) {
          return [...prev, { meal, quantity: 1 }]
        }
        return prev
      }
    })
  }

  const handleQuantityChange = (mealId: number, quantity: number) => {
    if (quantity <= 0) {
      // Remove meal if quantity is 0 or negative
      setSelectedMeals((prev) => prev.filter((item) => item.meal.id !== mealId))
      return
    }

    const currentTotal = selectedMeals.reduce((total, item) => total + item.quantity, 0)
    const currentMealQuantity = selectedMeals.find((item) => item.meal.id === mealId)?.quantity || 0
    const newTotal = currentTotal - currentMealQuantity + quantity

    if (newTotal <= mealsPerWeek) {
      setSelectedMeals((prev) =>
        prev.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)),
      )
    }
  }

  const isMealSelected = (meal: MenuItem) => {
    return selectedMeals.some((selected) => selected.meal.id === meal.id)
  }

  const getMealQuantity = (meal: MenuItem) => {
    const selected = selectedMeals.find((item) => item.meal.id === meal.id)
    return selected ? selected.quantity : 0
  }

  const getTotalSelectedMeals = () => {
    return selectedMeals.reduce((total, item) => total + item.quantity, 0)
  }

  const canSelectMore = getTotalSelectedMeals() < mealsPerWeek

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
            Select {mealsPerWeek} meals for your {user.subscription_frequency} plan
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-emerald-800 font-medium">
              {getTotalSelectedMeals()} of {mealsPerWeek} meals selected
            </p>
            {!canSelectMore && (
              <p className="text-emerald-600 text-sm mt-1">
                You've reached your meal limit for this week
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
                  const isSelected = isMealSelected(item)
                  const canSelect = canSelectMore || isSelected

                  return (
                    <div
                      key={item.id}
                      onClick={() => canSelect && handleMealToggle(item)}
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

                        {/* Nutrition Info */}
                        {item.nutritionInfo && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Calories: {item.nutritionInfo.calories}</span>
                              <span>Protein: {item.nutritionInfo.protein}g</span>
                              <span>Carbs: {item.nutritionInfo.carbs}g</span>
                              <span>Fat: {item.nutritionInfo.fat}g</span>
                            </div>
                          </div>
                        )}

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
                                  allergen(s) you're sensitive to
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
                          <div className="text-right">
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
                                  const currentQuantity = getMealQuantity(item)
                                  handleQuantityChange(item.id, currentQuantity - 1)
                                }}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                              >
                                -
                              </button>
                              <span className="text-lg font-semibold text-emerald-600 min-w-[2rem] text-center">
                                {getMealQuantity(item)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const currentQuantity = getMealQuantity(item)
                                  if (getTotalSelectedMeals() < mealsPerWeek) {
                                    handleQuantityChange(item.id, currentQuantity + 1)
                                  }
                                }}
                                disabled={getTotalSelectedMeals() >= mealsPerWeek}
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
                {(user as any).tier?.tier_name || 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Frequency</p>
              <p className="font-semibold text-gray-900 capitalize">
                {(user as any).subscription_frequency || 'Not selected'}
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
                {(user as any).subscription_frequency === 'weekly'
                  ? (user as any).tier?.weekly_price || '0.00'
                  : (user as any).subscription_frequency === 'monthly'
                    ? (user as any).tier?.monthly_price || '0.00'
                    : (user as any).tier?.weekly_price ||
                      (user as any).tier?.monthly_price ||
                      '0.00'}
                {(user as any).subscription_frequency === 'weekly'
                  ? '/week'
                  : (user as any).subscription_frequency === 'monthly'
                    ? '/month'
                    : ''}
              </p>
            </div>
          </div>

          {/* Allergen Charges Summary */}
          {allergenCharges > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Allergen Accommodation Charges</p>
                  <p className="text-xs text-gray-500">$5.00 per allergen per meal</p>
                </div>
                <p className="font-semibold text-lg text-orange-600">
                  +${allergenCharges.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
          <button
            onClick={async () => {
              if (selectedMeals.length === 0) {
                alert('Please select at least one meal before proceeding.')
                return
              }

              try {
                console.log('Submitting order with meals:', selectedMeals)

                // Submit order to API
                const response = await fetch('/api/orders/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    selectedMeals,
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
            disabled={getTotalSelectedMeals() !== mealsPerWeek}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              getTotalSelectedMeals() === mealsPerWeek
                ? 'text-white hover:bg-emerald-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: getTotalSelectedMeals() === mealsPerWeek ? '#5CB85C' : undefined,
            }}
          >
            Submit Order ({getTotalSelectedMeals()}/{mealsPerWeek})
          </button>
        </div>
      </div>
    </div>
  )
}
