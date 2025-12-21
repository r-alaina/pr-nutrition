// src/collections/Customers/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'tier', 'credit_balance', 'active'],
    group: 'System',
  },

  auth: {
    tokenExpiration: 12 * 60 * 60, // 12 hours
  },

  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      // Users can only see their own data, admins can see all
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
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        if (!req.payload) return

        // Check if customer has any orders
        const orders = await req.payload.find({
          collection: 'orders',
          where: {
            customer: {
              equals: typeof id === 'string' ? parseInt(id, 10) : id,
            },
          },
          limit: 1,
        })

        if (orders.totalDocs > 0) {
          throw new Error(
            `Cannot delete customer: Customer has ${orders.totalDocs} order(s) associated. Please delete or reassign orders first.`,
          )
        }

        return
      },
    ],
  },

  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
        position: 'sidebar',
      },
    },
    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'tiers',
      admin: {
        description: 'Customer pricing tier',
      },
    },
    {
      name: 'credit_balance',
      type: 'number',
      admin: {
        step: 0.01,
        description: 'Current monetary credit balance',
      },
    },
    {
      name: 'plan_credits',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of weekly credits remaining (for monthly plans)',
      },
    },
    {
      name: 'credit_bal_exp',
      type: 'date',
      admin: {
        description: 'Credit balance expiration date',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'preferences_set',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the customer has completed their preference setup',
      },
    },
    {
      name: 'subscription_frequency',
      type: 'text',
      admin: {
        description: 'Weekly or monthly subscription',
      },
    },
    {
      name: 'days_per_week',
      type: 'select',
      options: [
        { label: '5 Days (Mon-Fri)', value: '5' },
        { label: '7 Days (Mon-Sun)', value: '7' },
      ],
      admin: {
        description: 'Number of days per week (5 or 7)',
      },
    },
    {
      name: 'meals_per_day',
      type: 'select',
      options: [
        { label: '1 (Lunch)', value: '1' },
        { label: '2 (Lunch + Dinner)', value: '2' },
      ],
      admin: {
        description: 'Meals per day (1 or 2)',
      },
    },
    {
      name: 'meals_per_week',
      type: 'number',
      admin: {
        description: 'Total calculated meals per week',
      },
    },
    {
      name: 'include_breakfast',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include breakfast in subscription (Adds 1 meal per day)',
      },
    },
    {
      name: 'include_snacks',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include snacks in subscription',
      },
    },
    {
      name: 'allergies',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Customer allergies',
      },
    },
    {
      name: 'week_half',
      type: 'select',
      options: [
        { label: 'First Half (Sunday & Monday Pickup)', value: 'firstHalf' },
        { label: 'Second Half (Wednesday & Thursday Pickup)', value: 'secondHalf' },
      ],
      admin: {
        description: 'Which half of the week customer prefers for pickup',
      },
    },
  ],
}
