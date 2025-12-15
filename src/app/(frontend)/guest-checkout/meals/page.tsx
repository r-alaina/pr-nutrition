import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import GuestMealSelectionClient from './GuestMealSelectionClient'
import type { MenuItem } from '@/payload-types'

export default async function GuestMealSelectionPage() {
  const payload = await getPayload({ config })

  // Get all active menu items
  const allMenuItems = await payload.find({
    collection: 'menu-items',
    where: {
      active: {
        equals: true,
      },
    },
  })

  // Filter items by availability settings
  const firstHalfItems = allMenuItems.docs.filter((item) => {
    if (item.category === 'snack') return true // Snacks always available
    if (item.availability?.firstHalf && item.availability?.secondHalf) return true // Available for both
    if (item.availability?.firstHalf) return true
    return false
  })

  const secondHalfItems = allMenuItems.docs.filter((item) => {
    if (item.category === 'snack') return true // Snacks always available
    if (item.availability?.firstHalf && item.availability?.secondHalf) return true // Available for both
    if (item.availability?.secondHalf) return true
    return false
  })

  // Group menu items by category for each half
  const groupedFirstHalf = firstHalfItems.reduce(
    (acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  const groupedSecondHalf = secondHalfItems.reduce(
    (acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  // Category display order and labels
  const categoryOrder = [
    { key: 'lunch', label: 'Lunch Meals' },
    { key: 'dinner', label: 'Dinner Meals' },
    { key: 'premium', label: 'Premium Meals' },
    { key: 'breakfast-small', label: 'Breakfast (Small)' },
    { key: 'breakfast-large', label: 'Breakfast (Large)' },
    { key: 'dessert', label: 'Desserts' },
    { key: 'salad', label: 'Salads' },
    { key: 'snack', label: 'Snacks' },
  ]

  return (
    <GuestMealSelectionClient
      groupedFirstHalf={groupedFirstHalf}
      groupedSecondHalf={groupedSecondHalf}
      categoryOrder={categoryOrder}
    />
  )
}
