// src/collections/ChallengeParticipants/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const ChallengeParticipants: CollectionConfig = {
    slug: 'challenge-participants',
    admin: {
        useAsTitle: 'id',
        defaultColumns: ['customer', 'challenge', 'status', 'registeredAt'],
        group: 'Challenges',
    },
    access: {
        read: ({ req: { user } }) => {
            if (!user) return false
            return checkRole(['admin', 'editor'], user as User)
        },
        create: ({ req: { user } }) => {
            // Customers can register themselves, admins can register anyone
            if (!user) return false
            return true
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
            name: 'challenge',
            type: 'relationship',
            relationTo: 'challenges' as any,
            required: true,
            admin: {
                description: 'The challenge this participant is enrolled in',
            },
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'customers' as any,
            required: true,
            admin: {
                description: 'The customer participating in the challenge',
            },
        },
        {
            name: 'tier',
            type: 'relationship',
            relationTo: 'tiers' as any,
            required: true,
            admin: {
                description: 'The pricing tier selected for this challenge',
            },
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'registered',
            options: [
                { label: 'Registered', value: 'registered' },
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
                { label: 'Dropped', value: 'dropped' },
            ],
            admin: {
                description: 'Participation status',
                position: 'sidebar',
            },
        },
        {
            name: 'registeredAt',
            type: 'date',
            required: true,
            defaultValue: () => new Date().toISOString(),
            admin: {
                description: 'Date of registration',
                readOnly: true,
            },
        },
        {
            name: 'paymentStatus',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Paid', value: 'paid' },
                { label: 'Refunded', value: 'refunded' },
            ],
            admin: {
                description: 'Payment status for the challenge',
                position: 'sidebar',
            },
        },
        {
            name: 'paymentId',
            type: 'text',
            admin: {
                description: 'External payment transaction ID (from Stripe, Square, etc.)',
            },
        },
        {
            name: 'notes',
            type: 'textarea',
            admin: {
                description: 'Internal notes about this participant',
            },
        },
        // Track which weeks have had meals selected
        {
            name: 'weeksCompleted',
            type: 'array',
            admin: {
                description: 'Weeks for which meal selection has been completed',
            },
            fields: [
                {
                    name: 'weekNumber',
                    type: 'number',
                    required: true,
                    min: 1,
                    max: 3,
                },
                {
                    name: 'orderId',
                    type: 'relationship',
                    relationTo: 'orders',
                    admin: {
                        description: 'The order created for this week',
                    },
                },
            ],
        },
    ],
}
