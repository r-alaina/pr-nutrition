'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MenuItem, Customer, Order } from '@/payload-types'
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
  const [existingOrder, setExistingOrder] = useState<Order | null>(null)


  useEffect(() => {
    const fetchCurrentOrder = async () => {
      try {
        const res = await fetch('/api/orders/current')
        if (res.ok) {
          const data = await res.json()
          if (data.order) {
            setExistingOrder(data.order)
            // Parse existing items
            const firstHalf: { meal: MenuItem; quantity: number }[] = []
            const secondHalf: { meal: MenuItem; quantity: number }[] = []

            data.order.orderItems.forEach((item: { menuItem: MenuItem | string, quantity: number, weekHalf?: string }) => {
              const menuItem = item.menuItem as MenuItem
              const formattedItem = { meal: menuItem, quantity: item.quantity }
              if (item.weekHalf === 'secondHalf') {
                secondHalf.push(formattedItem)
              } else {
                firstHalf.push(formattedItem)
              }
            })
            setSelectedFirstHalfMeals(firstHalf)
            setSelectedSecondHalfMeals(secondHalf)
          }
        }
      } catch (err) {
        console.error('Failed to fetch current order', err)
      } finally {
        // setIsLoading(false) // Removed as isLoading state is removed
      }
    }
    fetchCurrentOrder()
  }, [])

  // Calculate Limits based on user plan
  const daysPerWeek = parseInt(user.days_per_week || '5', 10)
  const mealsPerDay = parseInt(user.meals_per_day || '2', 10)

  // Weekly limits
  const weeklyBreakfastLimit = user.include_breakfast ? daysPerWeek : 0
  const weeklyMainLimit = daysPerWeek * mealsPerDay

  // Adjust for frequency (Monthly = x4) - NOW REMOVED, we order 1 week at a time
  const isMonthly = user.subscription_frequency === 'monthly'
  // const multiplier = isMonthly ? 4 : 1 
  const multiplier = 1 // Always display 1 week's worth of meals per order

  const breakfastLimit = weeklyBreakfastLimit * multiplier
  const mainLimit = weeklyMainLimit * multiplier

  // Combine meals for calculations
  const selectedMeals = [...selectedFirstHalfMeals, ...selectedSecondHalfMeals]

  // Separate meals by type
  const selectedBreakfasts = selectedMeals.filter((item) => item.meal.category === 'breakfast')
  const selectedMains = selectedMeals.filter(
    (item) => item.meal.category !== 'breakfast' && item.meal.category !== 'snack',
  )
  const selectedSnacks = selectedMeals.filter((item) => item.meal.category === 'snack')

  // Calculate counts
  const breakfastCount = selectedBreakfasts.reduce((total, item) => total + item.quantity, 0)
  const mainCount = selectedMains.reduce((total, item) => total + item.quantity, 0)

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
        // Snacks are unlimited
        if (meal.category === 'snack') {
          return [...prev, { meal, quantity: 1 }]
        }

        // Logic for Breakfast
        if (meal.category === 'breakfast') {
          // Check limits across both halves
          const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals
          const otherHalfBreakfasts = otherHalf
            .filter((item) => item.meal.category === 'breakfast')
            .reduce((total, item) => total + item.quantity, 0)

          const currentHalfBreakfasts = prev
            .filter((item) => item.meal.category === 'breakfast')
            .reduce((total, item) => total + item.quantity, 0)

          if (currentHalfBreakfasts + otherHalfBreakfasts < breakfastLimit) {
            return [...prev, { meal, quantity: 1 }]
          }
        }
        // Logic for Mains (Lunch/Dinner/Premium/etc)
        else {
          const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals
          const otherHalfMains = otherHalf
            .filter((item) => item.meal.category !== 'breakfast' && item.meal.category !== 'snack')
            .reduce((total, item) => total + item.quantity, 0)

          const currentHalfMains = prev
            .filter((item) => item.meal.category !== 'breakfast' && item.meal.category !== 'snack')
            .reduce((total, item) => total + item.quantity, 0)

          if (currentHalfMains + otherHalfMains < mainLimit) {
            return [...prev, { meal, quantity: 1 }]
          }
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
      setter((prev) => prev.filter((item) => item.meal.id !== mealId))
      return
    }

    const meal = currentMeals.find((item) => item.meal.id === mealId)?.meal
    if (!meal) return

    // Snacks are unlimited
    if (meal.category === 'snack') {
      setter((prev) => prev.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)))
      return
    }

    // Check limits
    const isBreakfast = meal.category === 'breakfast'
    const limit = isBreakfast ? breakfastLimit : mainLimit

    // Calculate current totals EXCLUDING this item
    const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals

    const filterFn = isBreakfast
      ? (item: { meal: MenuItem }) => item.meal.category === 'breakfast'
      : (item: { meal: MenuItem }) => item.meal.category !== 'breakfast' && item.meal.category !== 'snack'

    const otherHalfCount = otherHalf
      .filter(filterFn)
      .reduce((total, item) => total + item.quantity, 0)

    const currentHalfCount = currentMeals
      .filter(filterFn)
      .filter(item => item.meal.id !== mealId) // Exclude current item being changed
      .reduce((total, item) => total + item.quantity, 0)

    if (otherHalfCount + currentHalfCount + quantity <= limit) {
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

  const getTotalSelectedSnacks = () => {
    return selectedSnacks.reduce((total, item) => total + item.quantity, 0)
  }

  const canSelectMoreBreakfast = breakfastCount < breakfastLimit
  const canSelectMoreMain = mainCount < mainLimit

  // Determine if a specific item can be selected/incremented
  const canSelectMoreOfResult = (meal: MenuItem) => {
    if (meal.category === 'snack') return true
    if (meal.category === 'breakfast') return canSelectMoreBreakfast
    return canSelectMoreMain
  }

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
            Select your meals for your {user.subscription_frequency} plan
          </p>

          {/* Tabs for First Half / Second Half */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setActiveTab('firstHalf')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'firstHalf'
                  ? 'bg-[#5CB85C] text-white'
                  : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                First Half Menu
                <span className="block text-xs mt-1">Sunday & Monday Pickup</span>
              </button>
              <button
                onClick={() => setActiveTab('secondHalf')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'secondHalf'
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
            <p className="text-sm text-emerald-700 font-medium mb-3 border-b border-emerald-200 pb-2">
              Your Plan Includes
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-sm text-emerald-700 mb-1">Breakfasts</p>
                <p className="text-emerald-800 font-bold text-2xl">
                  {breakfastCount} <span className="text-base font-normal text-emerald-600">/ {breakfastLimit}</span>
                </p>
                {breakfastLimit === 0 && (
                  <div className="text-xs text-red-500 mt-1">Not included in plan</div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-emerald-700 mb-1">Main Meals</p>
                <p className="text-emerald-800 font-bold text-2xl">
                  {mainCount} <span className="text-base font-normal text-emerald-600">/ {mainLimit}</span>
                </p>
              </div>
            </div>

            {getTotalSelectedSnacks() > 0 && (
              <p className="text-emerald-700 text-sm mt-4 text-center border-t border-emerald-200 pt-3">
                {getTotalSelectedSnacks()} a la carte snack(s) selected
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
                  const canSelect = canSelectMoreOfResult(item) || isSelected

                  return (
                    <div
                      key={item.id}
                      onClick={() => canSelect && handleMealToggle(item, activeTab)}
                      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all cursor-pointer ${isSelected
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
                                    className={`text-xs px-2 py-1 rounded ${isUserAllergic
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
                            {/* Different label for snacks */}
                            {item.category === 'snack' ? (
                              <div>
                                <div className="text-sm text-gray-500">A La Carte</div>
                                <div className="text-lg font-semibold text-blue-600">
                                  ${(item.price || 0).toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm text-gray-500">Included in plan</div>
                                <div className="text-lg font-semibold" style={{ color: '#5CB85C' }}>
                                  {user.subscription_frequency === 'weekly'
                                    ? 'Weekly'
                                    : user.subscription_frequency === 'monthly'
                                      ? 'Monthly'
                                      : 'Plan'}
                                </div>
                              </div>
                            )}
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
                                  if (canSelectMoreOfResult(item)) {
                                    handleQuantityChange(item.id, currentQuantity + 1, activeTab)
                                  }
                                }}
                                disabled={!canSelectMoreOfResult(item)}
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
              <p className="text-sm text-gray-600">Plan Allocation</p>
              <div className="font-semibold text-gray-900 text-sm">
                {weeklyBreakfastLimit > 0 ? (
                  <div>{weeklyBreakfastLimit} Breakfasts / week</div>
                ) : null}
                <div>{weeklyMainLimit} Main Meals / week</div>
                {isMonthly && <div className="text-xs text-gray-500">(x4 for Monthly)</div>}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan Price</p>
              <p className="font-semibold text-lg" style={{ color: '#5CB85C' }}>
                {existingOrder?.isCreditUsed || (isMonthly && (user.plan_credits || 0) > 0) ? (
                  <span>Paid with Plan Credit</span>
                ) : (
                  <span>$
                    {user.subscription_frequency === 'weekly'
                      ? 'Weekly Plan Price'
                      : user.subscription_frequency === 'monthly'
                        ? 'Monthly Plan Price'
                        : 'Start Subscription'
                    }</span>
                )}
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
              if (selectedMeals.length === 0) {
                alert('Please select at least one meal before proceeding.')
                return
              }


              const isMainComplete = mainCount === mainLimit

              if (!isMainComplete) {
                if (!confirm(`You have selected ${mainCount} of ${mainLimit} main meals. Are you sure you want to proceed?`)) {
                  return
                }
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

                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.message || 'Failed to submit order')
                }

                const { order } = await response.json()

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
            disabled={mainCount > mainLimit || breakfastCount > breakfastLimit}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${(mainCount <= mainLimit && breakfastCount <= breakfastLimit)
              ? 'bg-[#5CB85C] text-white hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  )
}

