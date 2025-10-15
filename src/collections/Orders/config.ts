import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'totalAmount', 'createdAt'],
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
      name: 'orderNumber',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Ready for Pickup', value: 'ready' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'orderItems',
      type: 'array',
      fields: [
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
          name: 'unitPrice',
          type: 'number',
          admin: {
            step: 0.01,
            description: 'Individual meal price (0 for tier-based subscriptions)',
          },
        },
        {
          name: 'totalPrice',
          type: 'number',
          admin: {
            step: 0.01,
            description: 'Total price for this item (0 for tier-based subscriptions)',
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'tiers',
      admin: {
        description: 'Customer tier at time of order',
      },
    },
    {
      name: 'subscriptionFrequency',
      type: 'select',
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'A La Carte', value: 'a_la_carte' },
      ],
    },
    {
      name: 'mealsPerWeek',
      type: 'number',
      admin: {
        description: 'Number of meals per week for this order',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes for this order',
      },
    },
  ],
}
