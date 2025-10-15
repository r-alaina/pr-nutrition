// src/collections/OrderReports/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const OrderReports: CollectionConfig = {
  slug: 'order-reports',
  admin: {
    useAsTitle: 'reportNumber',
    defaultColumns: ['reportNumber', 'menuItem', 'quantity', 'preparation_status', 'analysis_date'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
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
      name: 'reportNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data && !data.reportNumber) {
              data.reportNumber = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }
          },
        ],
      },
    },
    {
      name: 'menuItem',
      type: 'relationship',
      relationTo: 'menu-items',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'analysis_date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'kitchen_notes',
      type: 'textarea',
      admin: {
        description: 'Notes for kitchen staff',
      },
    },
    {
      name: 'preparation_status',
      type: 'text',
      defaultValue: 'not-started',
    },
  ],
}
