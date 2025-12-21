// src/app/(frontend)/menu/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import MenuClient from './components/MenuClient'
import type { MenuItem } from '@/payload-types'
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'

export default async function MenuPage() {
  const user = await getUser()
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

  let menuItemsDocs: MenuItem[] = []

  if (weeklyMenus.docs.length > 0) {
    const activeMenu = weeklyMenus.docs[0] as any
    const activeItems = new Map<string | number, MenuItem>()

    // Helper to add items
    const checkAndAdd = (item: any) => {
      if (item && typeof item === 'object' && 'id' in item) {
        activeItems.set(item.id, item as MenuItem)
      }
    }

    if (activeMenu.firstHalfMains) activeMenu.firstHalfMains.forEach(checkAndAdd)
    if (activeMenu.firstHalfSalads) activeMenu.firstHalfSalads.forEach(checkAndAdd)
    if (activeMenu.secondHalfMains) activeMenu.secondHalfMains.forEach(checkAndAdd)
    if (activeMenu.secondHalfSalads) activeMenu.secondHalfSalads.forEach(checkAndAdd)
    if (activeMenu.breakfasts) activeMenu.breakfasts.forEach(checkAndAdd)
    if (activeMenu.snacks) activeMenu.snacks.forEach(checkAndAdd)

    // Snacks are now part of the WeeklyMenu specific selection (or defaults), so no need to fetch separately unless fallback is desired.
    // For now, trusting the admin configuration.

    menuItemsDocs = Array.from(activeItems.values())
  } else {
    // Fallback: Get all active menu items if no Weekly Menu is active
    const allMenuItems = await payload.find({
      collection: 'menu-items',
      where: {
        active: {
          equals: true,
        },
      },
      limit: 100,
    })
    menuItemsDocs = allMenuItems.docs
  }

  // Group menu items by category
  const groupedItems = menuItemsDocs.reduce(
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
    { key: 'main', label: 'Lunch/Dinner' },
    { key: 'premium', label: 'Premium Meals' },
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'dessert', label: 'Desserts' },
    { key: 'salad', label: 'Salads' },
    { key: 'snack', label: 'Snacks' },
  ]

  return (
    <MenuClient
      groupedItems={groupedItems}
      categoryOrder={categoryOrder}
      user={user || undefined}
    />
  )
}
