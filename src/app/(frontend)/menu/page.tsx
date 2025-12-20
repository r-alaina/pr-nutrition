// src/app/(frontend)/menu/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import MenuClient from './components/MenuClient'
import type { MenuItem } from '@/payload-types'
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'

export default async function MenuPage() {
  const user = await getUser()
  const payload = await getPayload({ config })

  // Get all active menu items
  const menuItems = await payload.find({
    collection: 'menu-items',
    where: {
      active: {
        equals: true,
      },
    },
  })

  // Group menu items by category
  const groupedItems = menuItems.docs.reduce(
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
