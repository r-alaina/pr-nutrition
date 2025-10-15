'use client'

import Link from 'next/link'
import type { MenuItem, Customer } from '@/payload-types'
import AuthenticatedHeader from '../../components/AuthenticatedHeader'

interface MenuClientProps {
  groupedItems: Record<string, MenuItem[]>
  categoryOrder: Array<{ key: string; label: string }>
  user?: Customer
}

export default function MenuClient({ groupedItems, categoryOrder, user }: MenuClientProps) {
  // Get the meal price (temporarily using single price field)
  const getMealPrice = (meal: MenuItem) => {
    return meal.price || 0
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
                <Link href="/menu" className="font-medium" style={{ color: '#5CB85C' }}>
                  Menu
                </Link>
                <Link
                  href={(user as any)?.preferences_set ? '/meal-selection' : '/order-now'}
                  className="text-gray-700 font-medium"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5CB85C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                >
                  {user?.preferences_set ? 'Order Meals' : 'Order Now'}
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

      {/* Pickup Times Banner */}
      <div className="text-white py-6" style={{ backgroundColor: '#5CB85C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Pick-Up Times</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">1st Half Menu:</p>
                <p className="text-sm mb-1">SUNDAY 3pm-6pm & MONDAY 10am-6pm</p>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Order deadline: 12am (midnight)
                </p>
              </div>
              <div
                className="hidden lg:block w-px h-16"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              ></div>
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">2nd Half Menu:</p>
                <p className="text-sm mb-1">WEDNESDAY 3pm-6pm & THURSDAY 10am-6pm</p>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Order deadline: Tuesday at 5pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600">Fresh, healthy meals prepared with care</p>
        </div>

        {/* Menu Categories */}
        {categoryOrder.map(({ key, label }) => {
          const items = groupedItems[key] || []
          if (items.length === 0) return null

          return (
            <div key={key} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{label}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow"
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
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>

                      {/* Nutrition Info */}
                      {item.nutritionInfo && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {item.nutritionInfo.calories && (
                              <div>
                                <span className="font-semibold text-gray-700">Calories:</span>
                                <span className="ml-2 text-gray-600">
                                  {item.nutritionInfo.calories}
                                </span>
                              </div>
                            )}
                            {item.nutritionInfo.protein && (
                              <div>
                                <span className="font-semibold text-gray-700">Protein:</span>
                                <span className="ml-2 text-gray-600">
                                  {item.nutritionInfo.protein}g
                                </span>
                              </div>
                            )}
                            {item.nutritionInfo.carbs && (
                              <div>
                                <span className="font-semibold text-gray-700">Carbs:</span>
                                <span className="ml-2 text-gray-600">
                                  {item.nutritionInfo.carbs}g
                                </span>
                              </div>
                            )}
                            {item.nutritionInfo.fat && (
                              <div>
                                <span className="font-semibold text-gray-700">Fat:</span>
                                <span className="ml-2 text-gray-600">
                                  {item.nutritionInfo.fat}g
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Allergens */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Allergens:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.allergens.map((allergen, index) => (
                              <span
                                key={index}
                                className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                              >
                                {allergen.allergen}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold" style={{ color: '#5CB85C' }}>
                          ${getMealPrice(item).toFixed(2)}
                        </span>
                        <Link
                          href={(user as any)?.preferences_set ? '/meal-selection' : '/order-now'}
                          className="text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                          style={{ backgroundColor: '#5CB85C' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
                        >
                          {(user as any)?.preferences_set ? 'Order Meals' : 'Order Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h3>
          <p className="text-gray-600 mb-6">Choose your meals and place your order for pickup</p>
          <Link
            href="/order-now"
            className="text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
          >
            Start Ordering
          </Link>
        </div>
      </div>
    </div>
  )
}
