import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const WeeklyMenus: CollectionConfig = {
  slug: 'weekly-menus',
  admin: {
    useAsTitle: 'weekLabel',
    defaultColumns: ['weekLabel', 'startDate', 'endDate', 'active'],
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
      return checkRole(['admin'], user as User)
    },
  },
  fields: [
    {
      name: 'weekLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'firstHalfItems',
      type: 'array',
      fields: [
        {
          name: 'menuItem',
          type: 'relationship',
          relationTo: 'menu-items',
          required: true,
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'secondHalfItems',
      type: 'array',
      fields: [
        {
          name: 'menuItem',
          type: 'relationship',
          relationTo: 'menu-items',
          required: true,
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
