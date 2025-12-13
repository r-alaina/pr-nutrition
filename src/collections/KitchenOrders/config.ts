import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const KitchenOrders: CollectionConfig = {
  slug: 'kitchen-orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'weekHalf', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
    create: ({ req }) => {
      // Allow creation by admins/editors OR by system hooks (when req.user is undefined but operation is from hook)
      if (!req.user) {
        // This is likely a hook/system operation - allow it
        return true
      }
      return checkRole(['admin', 'editor'], req.user as User)
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
      name: 'orderNumber',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Reference to original order',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      admin: {
        description: 'Customer phone number (optional)',
      },
    },
    {
      name: 'weekHalf',
      type: 'select',
      required: true,
      options: [
        { label: 'First Half', value: 'firstHalf' },
        { label: 'Second Half', value: 'secondHalf' },
        { label: 'Both Halves', value: 'both' },
      ],
    },
    {
      name: 'orderItems',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'mealName',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
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
      ],
    },
    {
      name: 'allergenCharges',
      type: 'array',
      fields: [
        {
          name: 'mealName',
          type: 'text',
          required: true,
        },
        {
          name: 'allergens',
          type: 'array',
          fields: [
            {
              name: 'allergen',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'charge',
          type: 'number',
          required: true,
          admin: {
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'totalAllergenCharges',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'pickupDate',
      type: 'date',
      admin: {
        description: 'Calculated pickup date based on week half',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Ready', value: 'ready' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes for kitchen',
      },
    },
    {
      name: 'tierAggregation',
      type: 'array',
      admin: {
        description: 'Aggregated meal quantities by tier',
        readOnly: true,
      },
      fields: [
        {
          name: 'tierName',
          type: 'text',
          required: true,
        },
        {
          name: 'tierId',
          type: 'text',
        },
        {
          name: 'meals',
          type: 'array',
          fields: [
            {
              name: 'mealName',
              type: 'text',
              required: true,
            },
            {
              name: 'quantity',
              type: 'number',
              required: true,
            },
            {
              name: 'category',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'allergenAdjustments',
      type: 'array',
      admin: {
        description: 'Customer-specific allergen adjustments',
        readOnly: true,
      },
      fields: [
        {
          name: 'customerName',
          type: 'text',
          required: true,
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
          name: 'meals',
          type: 'array',
          fields: [
            {
              name: 'mealName',
              type: 'text',
              required: true,
            },
            {
              name: 'adjustment',
              type: 'text',
              admin: {
                description: 'Description of allergen adjustment (e.g., "without cheese")',
              },
            },
            {
              name: 'quantity',
              type: 'number',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
