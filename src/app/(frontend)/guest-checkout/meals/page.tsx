import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import GuestMealSelectionClient from './GuestMealSelectionClient'
import type { MenuItem } from '@/payload-types'

export default async function GuestMealSelectionPage() {
  const payload = await getPayload({ config })

  // Get active weekly menu
  const weeklyMenus = await payload.find({
    collection: 'weekly-menus',
    where: {
      active: {
        equals: true,
      },
    },
    limit: 1,
    sort: '-startDate',
  })

  // Get all active menu items
  const allMenuItems = await payload.find({
    collection: 'menu-items',
    where: {
      active: {
        equals: true,
      },
    },
  })

  // Separate items for first half, second half, and both halves
  let firstHalfItems: MenuItem[] = []
  let secondHalfItems: MenuItem[] = []

  // If there's an active weekly menu, filter by it
  if (weeklyMenus.docs.length > 0) {
    const activeWeeklyMenu = weeklyMenus.docs[0]
    const firstHalfMenuItems = activeWeeklyMenu.firstHalfItems || []
    const secondHalfMenuItems = activeWeeklyMenu.secondHalfItems || []

    const firstHalfIds = new Set(
      firstHalfMenuItems
        .filter((item: any) => item.available !== false)
        .map((item: any) =>
          String(typeof item.menuItem === 'object' ? item.menuItem.id : item.menuItem),
        ),
    )

    const secondHalfIds = new Set(
      secondHalfMenuItems
        .filter((item: any) => item.available !== false)
        .map((item: any) =>
          String(typeof item.menuItem === 'object' ? item.menuItem.id : item.menuItem),
        ),
    )

    // Filter items for first half
    firstHalfItems = allMenuItems.docs.filter((item) => {
      if (item.category === 'snack') return true // Snacks always available
      if (firstHalfIds.has(String(item.id))) return true
      if (item.availability?.firstHalf && item.availability?.secondHalf) return true // Available for both
      if (item.availability?.firstHalf) return true
      return false
    })

    // Filter items for second half
    secondHalfItems = allMenuItems.docs.filter((item) => {
      if (item.category === 'snack') return true // Snacks always available
      if (secondHalfIds.has(String(item.id))) return true
      if (item.availability?.firstHalf && item.availability?.secondHalf) return true // Available for both
      if (item.availability?.secondHalf) return true
      return false
    })
  } else {
    // No weekly menu - filter by availability settings only
    firstHalfItems = allMenuItems.docs.filter((item) => {
      if (item.category === 'snack') return true
      if (item.availability?.firstHalf && item.availability?.secondHalf) return true
      if (item.availability?.firstHalf) return true
      return false
    })

    secondHalfItems = allMenuItems.docs.filter((item) => {
      if (item.category === 'snack') return true
      if (item.availability?.firstHalf && item.availability?.secondHalf) return true
      if (item.availability?.secondHalf) return true
      return false
    })
  }

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
