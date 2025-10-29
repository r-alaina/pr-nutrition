// src/collections/MenuItems/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'active'],
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
      required: true,
      admin: {
        step: 0.01,
        description: 'Base price for this item',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Lunch Meal', value: 'lunch' },
        { label: 'Dinner Meal', value: 'dinner' },
        { label: 'Premium Meal', value: 'premium' },
        { label: 'Breakfast (Small)', value: 'breakfast-small' },
        { label: 'Breakfast (Large)', value: 'breakfast-large' },
        { label: 'Dessert', value: 'dessert' },
        { label: 'Salad', value: 'salad' },
        { label: 'Snack', value: 'snack' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
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
      name: 'nutritionInfo',
      type: 'group',
      fields: [
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'number' },
        { name: 'carbs', type: 'number' },
        { name: 'fat', type: 'number' },
      ],
    },
    {
      name: 'availability',
      type: 'group',
      admin: {
        description: 'Select when this menu item is available.',
      },
      fields: [
        {
          name: 'firstHalf',
          label: 'Available in First Half (Sunday Pickup)',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'secondHalf',
          label: 'Available in Second Half (Wednesday Pickup)',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
