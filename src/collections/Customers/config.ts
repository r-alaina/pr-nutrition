// src/collections/Customers/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'tier', 'credit_balance', 'active'],
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

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
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
        description: 'Current credit balance',
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
      name: 'dietary_restrictions',
      type: 'relationship',
      relationTo: 'dietary-restrictions',
      hasMany: true,
      admin: {
        description: 'Customer dietary restrictions',
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
      name: 'meals_per_week',
      type: 'number',
      admin: {
        description: 'Number of meals per week',
      },
    },
    {
      name: 'include_breakfast',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include breakfast in subscription',
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
      name: 'preferred_pickup_time',
      type: 'text',
      admin: {
        description: 'Preferred pickup time',
      },
    },
  ],
}
