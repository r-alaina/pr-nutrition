// src/collections/Tiers/config.ts
import type { CollectionConfig } from 'payload'

export const Tiers: CollectionConfig = {
  slug: 'tiers',
  admin: {
    useAsTitle: 'tier_name',
    defaultColumns: ['tier_name', 'monthly_price', 'weekly_price', 'single_price'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'tier_name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'monthly_price',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'weekly_price',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'single_price',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
  ],
}
