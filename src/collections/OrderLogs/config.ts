
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const OrderLogs: CollectionConfig = {
    slug: 'order-logs',
    admin: {
        useAsTitle: 'id',
        defaultColumns: ['order', 'customer', 'changeDescription', 'createdAt'],
    },
    access: {
        read: ({ req: { user } }) => {
            if (!user) return false
            return checkRole(['admin', 'editor'], user as User) || (typeof user.id === 'string' || typeof user.id === 'number')
        },
        create: () => true, // Allow backend to create logs
    },
    fields: [
        {
            name: 'order',
            type: 'relationship',
            relationTo: 'orders',
            required: true,
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'customers',
            required: true,
        },
        {
            name: 'changeDescription',
            type: 'text',
            required: true,
        },
        {
            name: 'previousItems',
            type: 'json',
        },
        {
            name: 'newItems',
            type: 'json',
        },
    ],
}
