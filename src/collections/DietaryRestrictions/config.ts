// src/collections/DietaryRestrictions/config.ts
import type { CollectionConfig } from 'payload'

export const DietaryRestrictions: CollectionConfig = {
  slug: 'dietary-restrictions',
  admin: {
    useAsTitle: 'restriction_name',
    group: 'System',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'restriction_name',
      type: 'text',
      required: true,
    },
  ],
}