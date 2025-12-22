'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Customer, Order } from '@/payload-types'
import AuthenticatedHeader from '../components/AuthenticatedHeader'

interface OrderHistoryClientProps {
  user: Customer
}

export default function OrderHistoryClient({ user }: OrderHistoryClientProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders/get-user-orders')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load order history')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AuthenticatedHeader user={user} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader user={user} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View all your past and current orders</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href={user?.preferences_set ? '/meal-selection' : '/order-now'}
              className="inline-flex items-center px-6 py-3 text-white rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#5CB85C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A9D4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5CB85C')}
            >
              Place Your First Order
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const menuItems = order.orderItems || []


              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          Order {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                        <span className="text-2xl font-bold" style={{ color: '#5CB85C' }}>
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {menuItems.length > 0 && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items:</h4>
                        <div className="space-y-2">
                          {menuItems.map((item, index) => {
                            const menuItem =
                              typeof item.menuItem === 'object' ? item.menuItem : null
                            return (
                              <div
                                key={index}
                                className="flex justify-between items-start text-sm bg-gray-50 p-3 rounded"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {menuItem?.name || 'Unknown Item'}
                                  </p>
                                  {item.weekHalf && (
                                    <p className="text-gray-600 text-xs mt-1">
                                      Week Half:{' '}
                                      {item.weekHalf === 'firstHalf' ? 'First Half' : 'Second Half'}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-gray-900">Qty: {item.quantity}</p>
                                  {item.totalPrice && item.totalPrice > 0 && (
                                    <p className="text-gray-600 text-xs">
                                      ${item.totalPrice.toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {order.totalAllergenCharges > 0 && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-sm text-gray-600">
                          Allergen Charges:{' '}
                          <span className="font-medium">
                            ${order.totalAllergenCharges.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center text-sm">
                      <div>
                        <p className="text-gray-600">
                          Subtotal:{' '}
                          <span className="font-medium text-gray-900">
                            ${order.subtotal.toFixed(2)}
                          </span>
                        </p>
                        {order.taxAmount > 0 && (
                          <p className="text-gray-600 mt-1">
                            Tax:{' '}
                            <span className="font-medium text-gray-900">
                              ${order.taxAmount.toFixed(2)}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Total:</p>
                        <p className="text-2xl font-bold" style={{ color: '#5CB85C' }}>
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
