'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { MenuItem } from '@/payload-types'
import { BreakfastIcon, MainIcon, SnackIcon, SaladIcon } from '../../components/CategoryIcons'

interface Tier {
  id: string
  tier_name: string
  description: string
  weekly_price: number
  monthly_price: number
  single_price: number
}

interface GuestMealSelectionClientProps {
  groupedFirstHalf: Record<string, MenuItem[]>
  groupedSecondHalf: Record<string, MenuItem[]>
  categoryOrder: Array<{ key: string; label: string }>
}

// Helper to get card styles based on category
const getCardStyles = (category: string) => {
  switch (category) {
    case 'breakfast':
    case 'breakfast-small':
    case 'breakfast-large':
      return {
        borderColor: 'border-brand-orange',
        bgColor: 'bg-orange-50',
        textColor: 'text-brand-orange',
        buttonColor: 'bg-brand-orange',
        hoverColor: 'hover:bg-orange-600',
        lightBg: 'bg-orange-100',
        Icon: BreakfastIcon,
        iconColor: 'bg-brand-orange',
      }
    case 'snack':
    case 'dessert':
      return {
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        buttonColor: 'bg-purple-600',
        hoverColor: 'hover:bg-purple-700',
        lightBg: 'bg-purple-100',
        Icon: SnackIcon,
        iconColor: 'bg-purple-500',
      }
    case 'salad':
      return {
        borderColor: 'border-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        buttonColor: 'bg-green-600',
        hoverColor: 'hover:bg-green-700',
        lightBg: 'bg-green-100',
        Icon: SaladIcon,
        iconColor: 'bg-green-500',
      }
    default: // Main/Premium
      return {
        borderColor: 'border-brand-primary',
        bgColor: 'bg-green-50',
        textColor: 'text-brand-primary',
        buttonColor: 'bg-brand-primary',
        hoverColor: 'hover:bg-brand-dark',
        lightBg: 'bg-brand-primary/10',
        Icon: MainIcon,
        iconColor: 'bg-brand-primary',
      }
  }
}

export default function GuestMealSelectionClient({
  groupedFirstHalf,
  groupedSecondHalf,
  categoryOrder,
}: GuestMealSelectionClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<'firstHalf' | 'secondHalf'>('firstHalf')
  const [selectedFirstHalfMeals, setSelectedFirstHalfMeals] = useState<
    { meal: MenuItem; quantity: number }[]
  >([])
  const [selectedSecondHalfMeals, setSelectedSecondHalfMeals] = useState<
    { meal: MenuItem; quantity: number }[]
  >([])
  const [guestTier, setGuestTier] = useState<Tier | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get tier from sessionStorage
  useEffect(() => {
    const storedTier = sessionStorage.getItem('guestTier')
    if (storedTier) {
      try {
        setGuestTier(JSON.parse(storedTier))
      } catch (e) {
        console.error('Error parsing guest tier:', e)
      }
    }
  }, [])

  // Default meals per week for guests (same as auth users typically use)
  const mealsPerWeek = 10

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

  // Combine meals for display
  const selectedMeals = [...selectedFirstHalfMeals, ...selectedSecondHalfMeals]
  const selectedMealsOnly = selectedMeals.filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
  const selectedSnacks = selectedMeals.filter((item) => item.meal.category === 'snack' || item.meal.category === 'dessert')

  const totalSelectedMeals = selectedMealsOnly.reduce((total, item) => total + item.quantity, 0)

  const getTotalSelectedMeals = (half?: 'firstHalf' | 'secondHalf') => {
    if (half === 'firstHalf') {
      return selectedFirstHalfMeals
        .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
        .reduce((total, item) => total + item.quantity, 0)
    }
    if (half === 'secondHalf') {
      return selectedSecondHalfMeals
        .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
        .reduce((total, item) => total + item.quantity, 0)
    }
    const firstHalfTotal = selectedFirstHalfMeals
      .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
      .reduce((total, item) => total + item.quantity, 0)
    const secondHalfTotal = selectedSecondHalfMeals
      .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
      .reduce((total, item) => total + item.quantity, 0)
    return firstHalfTotal + secondHalfTotal
  }

  const getTotalSelectedSnacks = () => {
    return selectedSnacks.reduce((total, item) => total + item.quantity, 0)
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

  const handleMealToggle = (meal: MenuItem, half: 'firstHalf' | 'secondHalf') => {
    const setter = half === 'firstHalf' ? setSelectedFirstHalfMeals : setSelectedSecondHalfMeals
    const currentMeals = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals

    setter((prev) => {
      const existingIndex = prev.findIndex((item) => item.meal.id === meal.id)

      if (existingIndex >= 0) {
        // Remove meal
        return prev.filter((item) => item.meal.id !== meal.id)
      } else {
        // Snacks/Desserts don't count toward meal limit
        if (meal.category === 'snack' || meal.category === 'dessert') {
          return [...prev, { meal, quantity: 1 }]
        }
        // Add meal if under total limit (across both halves)
        const currentMealTotal = prev
          .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
          .reduce((total, item) => total + item.quantity, 0)

        // Get the total from the other half
        const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals
        const otherHalfTotal = otherHalf
          .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
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
      setter((prev) => prev.filter((item) => item.meal.id === mealId))
      return
    }

    const meal = currentMeals.find((item) => item.meal.id === mealId)?.meal
    if (!meal) return

    // Snacks/Desserts don't count toward meal limit
    if (meal.category === 'snack' || meal.category === 'dessert') {
      setter((prev) => prev.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)))
      return
    }

    // For meals, check against total limit across both halves
    const currentMealTotal = currentMeals
      .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
      .reduce((total, item) => total + item.quantity, 0)
    const currentMealQuantity = currentMeals.find((item) => item.meal.id === mealId)?.quantity || 0

    // Get the total from the other half
    const otherHalf = half === 'firstHalf' ? selectedSecondHalfMeals : selectedFirstHalfMeals
    const otherHalfTotal = otherHalf
      .filter((item) => item.meal.category !== 'snack' && item.meal.category !== 'dessert')
      .reduce((total, item) => total + item.quantity, 0)

    // Calculate new total across both halves
    const newCurrentHalfTotal = currentMealTotal - currentMealQuantity + quantity
    const newTotal = newCurrentHalfTotal + otherHalfTotal

    if (newTotal <= mealsPerWeek) {
      setter((prev) => prev.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)))
    }
  }

  const handleContinue = () => {
    if (selectedMeals.length === 0) {
      alert('Please select at least one meal before proceeding.')
      return
    }

    // Store selected meals in sessionStorage
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

    sessionStorage.setItem('guestSelectedMeals', JSON.stringify(mealsWithHalf))

    // Redirect to allergen selection page
    router.push('/guest-checkout/allergens')
  }

  // Total meals across both halves cannot exceed mealsPerWeek
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/images/brand/logo.png"
                  alt="Meal PREPS Logo"
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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === link.href
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Selection Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Meals</h1>
          <p className="text-xl text-gray-600 mb-6">
            Select up to {mealsPerWeek} meals total (split between first and second half)
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
                  const canSelect = currentCanSelectMore || isSelected || item.category === 'snack' || item.category === 'dessert'
                  const styles = getCardStyles(item.category || 'default');

                  return (
                    <div
                      key={item.id}
                      onClick={() => canSelect && handleMealToggle(item, activeTab)}
                      className={`relative bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all cursor-pointer ${isSelected
                        ? styles.borderColor + ' ' + styles.bgColor
                        : canSelect
                          ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                    >
                      {/* Watermark Icon */}
                      <div
                        className={`absolute -right-4 -top-4 w-32 h-32 opacity-5 pointer-events-none z-0 transform rotate-12 ${styles.iconColor}`}
                        style={{
                          maskImage: `url('${item.category === 'breakfast' || item.category.includes('breakfast')
                            ? '/assets/icons/breakfast.png'
                            : item.category === 'snack' || item.category === 'dessert'
                              ? '/assets/icons/snack.png'
                              : item.category === 'salad'
                                ? '/assets/icons/salad.png'
                                : '/assets/icons/main.png'
                            }')`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskImage: `url('${item.category === 'breakfast' || item.category.includes('breakfast')
                            ? '/assets/icons/breakfast.png'
                            : item.category === 'snack' || item.category === 'dessert'
                              ? '/assets/icons/snack.png'
                              : item.category === 'salad'
                                ? '/assets/icons/salad.png'
                                : '/assets/icons/main.png'
                            }')`,
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                        }}
                      />

                      <div className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 pr-4">
                            {/* Category Label with Icon */}
                            <div className={`flex items-center gap-2 mb-2 ${styles.textColor} font-medium text-sm uppercase tracking-wider`}>
                              <styles.Icon className={`w-5 h-5 ${styles.iconColor}`} />
                              <span>{item.category === 'dessert' ? 'Snack' : item.category === 'premium' ? 'Main' : item.category.replace('-', ' ')}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 leading-tight">{item.name}</h3>
                          </div>

                          {item.category === 'premium' && (
                            <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                              Premium
                            </span>
                          )}
                          {isSelected && (
                            <div className={styles.textColor}>
                              <svg className="w-8 h-8 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 min-h-[4.5em]">{item.description}</p>

                        {/* Allergens */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-2">
                            {item.allergens.map((allergen, index) => (
                              <span
                                key={index}
                                className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-medium"
                              >
                                {allergen.allergen}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                              {item.category === 'snack' || item.category === 'dessert' ? 'Price' : 'Included in Plan'}
                            </div>
                            <div className={`text-lg font-bold ${styles.textColor}`}>
                              {item.category === 'snack' || item.category === 'dessert'
                                ? (item.price ? `$${item.price.toFixed(2)}` : 'A la carte')
                                : (guestTier?.tier_name || 'Tier Plan')}
                            </div>
                          </div>

                          {isSelected ? (
                            <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm p-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const currentQuantity = getMealQuantity(item, activeTab)
                                  handleQuantityChange(item.id, currentQuantity - 1, activeTab)
                                }}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                              >
                                -
                              </button>
                              <span className={`w-10 text-center font-bold text-lg ${styles.textColor}`}>
                                {getMealQuantity(item, activeTab)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const currentQuantity = getMealQuantity(item, activeTab)
                                  if (totalSelectedMeals < mealsPerWeek || item.category === 'snack' || item.category === 'dessert') {
                                    handleQuantityChange(item.id, currentQuantity + 1, activeTab)
                                  }
                                }}
                                disabled={totalSelectedMeals >= mealsPerWeek && item.category !== 'snack' && item.category !== 'dessert'}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${styles.buttonColor} ${styles.hoverColor}`}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className={`text-sm font-semibold ${canSelect ? styles.textColor : 'text-gray-400'}`}>
                              {canSelect ? 'Click to Select' : 'Limit Reached'}
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
        {guestTier && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tier</p>
                <p className="font-semibold text-gray-900">{guestTier.tier_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Meals per Week</p>
                <p className="font-semibold text-gray-900">{mealsPerWeek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Price</p>
                <p className="font-semibold text-lg" style={{ color: '#5CB85C' }}>
                  ${(guestTier.weekly_price || 0).toFixed(2)}/week
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-12">
          <Link
            href="/guest-checkout"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back
          </Link>
          <button
            onClick={handleContinue}
            disabled={selectedMeals.length === 0 || totalSelectedMeals > mealsPerWeek}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${selectedMeals.length > 0 && totalSelectedMeals <= mealsPerWeek
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue to Checkout ({totalSelectedMeals}/{mealsPerWeek})
          </button>
        </div>
      </div>
    </div>
  )
}
