import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { getPayload } from 'payload'
import config from '@/payload.config'
import MealSelectionClient from './MealSelectionClient'
import type { MenuItem } from '@/payload-types'

export default async function MealSelectionPage() {
  const user = await getUser()

  if (!user) {
    // Redirect to login if not authenticated
    return <div>Redirecting to login...</div>
  }

  // Check if user has preferences set up
  if (!user.preferences_set) {
    // Redirect to order-now for preference setup
    return <div>Redirecting to preference setup...</div>
  }

  const payload = await getPayload({ config })

  // Try to find an active Weekly Menu
  const weeklyMenus = await payload.find({
    collection: 'weekly-menus' as any,
    where: {
      status: {
        equals: 'active',
      },
    },
    limit: 1,
  })

  let firstHalfDocs: MenuItem[] = []
  let secondHalfDocs: MenuItem[] = []

  if (weeklyMenus.docs.length > 0) {
    const activeMenu = weeklyMenus.docs[0] as any

    // Helper to filter valid items
    const getValidItems = (items: any[]): MenuItem[] => {
      if (!items) return []
      return items.filter(item => item && typeof item === 'object' && 'id' in item) as MenuItem[]
    }

    const mainFirst = getValidItems(activeMenu.firstHalfMains)
    const saladFirst = getValidItems(activeMenu.firstHalfSalads)
    const mainSecond = getValidItems(activeMenu.secondHalfMains)
    const saladSecond = getValidItems(activeMenu.secondHalfSalads)
    const breakfasts = getValidItems(activeMenu.breakfasts)
    const snacks = getValidItems(activeMenu.snacks) // Now coming from the menu itself

    // Combine for display
    firstHalfDocs = [...mainFirst, ...saladFirst, ...breakfasts, ...snacks]
    secondHalfDocs = [...mainSecond, ...saladSecond, ...breakfasts, ...snacks]

  } else {
    // FALLBACK: Old logic
    // Get all active menu items
    const allMenuItems = await payload.find({
      collection: 'menu-items',
      where: {
        active: {
          equals: true,
        },
      },
      limit: 100,
    })

    // Filter items by availability settings
    firstHalfDocs = allMenuItems.docs.filter((item) => {
      if (item.category === 'snack') return true // Snacks always available
      if (item.availability?.firstHalf && item.availability?.secondHalf) return true // Available for both
      if (item.availability?.firstHalf) return true
      return false
    })

    secondHalfDocs = allMenuItems.docs.filter((item) => {
      if (item.category === 'snack') return true // Snacks always available
      if (item.availability?.firstHalf && item.availability?.secondHalf) return true // Available for both
      if (item.availability?.secondHalf) return true
      return false
    })
  }

  // Group menu items by category for each half
  const groupedFirstHalf = firstHalfDocs.reduce(
    (acc, item) => {
      let category = item.category
      if (category === 'premium') category = 'main'
      if (category === 'dessert') category = 'snack'

      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  const groupedSecondHalf = secondHalfDocs.reduce(
    (acc, item) => {
      let category = item.category
      if (category === 'premium') category = 'main'
      if (category === 'dessert') category = 'snack'

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
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'main', label: 'Lunch/Dinner' },
    { key: 'salad', label: 'Salads' },
    { key: 'snack', label: 'Snacks' },
  ]

  return (
    <MealSelectionClient
      groupedFirstHalf={groupedFirstHalf}
      groupedSecondHalf={groupedSecondHalf}
      categoryOrder={categoryOrder}
      user={user}
    />
  )
}
