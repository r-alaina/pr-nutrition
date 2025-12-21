// src/collections/MenuItems/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'active'],
    group: 'Operations',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: false,
      admin: {
        step: 0.01,
        description: 'Price for snacks only (a la carte). Meals are priced by tier subscription.',
        condition: (data) => data.category === 'snack',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Lunch/Dinner', value: 'main' },
        { label: 'Premium Meal', value: 'premium' },
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Dessert', value: 'dessert' },
        { label: 'Salad', value: 'salad' },
        { label: 'Snack', value: 'snack' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allergens',
      type: 'array',
      fields: [
        {
          name: 'allergen',
          type: 'text',
        },
      ],
    },
    {
      name: 'availability',
      type: 'group',
      admin: {
        description:
          'Select which half of the week this menu item is available. Salads and snacks can be available for both halves.',
      },
      fields: [
        {
          name: 'firstHalf',
          label: 'Available in First Half (Sunday 3pm-6pm & Monday 10am-6pm)',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'secondHalf',
          label: 'Available in Second Half (Wednesday 3pm-6pm & Thursday 10am-6pm)',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
