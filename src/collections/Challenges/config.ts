// src/collections/Challenges/config.ts
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

export const Challenges: CollectionConfig = {
    slug: 'challenges',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'startDate', 'status', 'price'],
        group: 'Challenges',
    },
    access: {
        read: () => true, // Public can view challenges
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
            name: 'name',
            type: 'text',
            required: true,
            admin: {
                description: 'Challenge name (e.g., "January 2025 21-Day Challenge")',
            },
        },
        {
            name: 'description',
            type: 'richText',
            admin: {
                description: 'Description shown on the challenge signup page',
            },
        },
        {
            name: 'startDate',
            type: 'date',
            required: true,
            admin: {
                description: 'First day of the 21-day challenge',
            },
        },
        {
            name: 'endDate',
            type: 'date',
            admin: {
                description: 'Auto-calculated: startDate + 21 days',
                readOnly: true,
            },
        },
        {
            name: 'registrationDeadline',
            type: 'date',
            required: true,
            admin: {
                description: 'Last day to register for this challenge',
            },
        },
        {
            name: 'price',
            type: 'number',
            required: true,
            admin: {
                step: 0.01,
                description: 'Price for the full 21-day challenge',
            },
        },
        {
            name: 'maxParticipants',
            type: 'number',
            admin: {
                description: 'Maximum number of participants (leave empty for unlimited)',
            },
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'upcoming',
            options: [
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Registration Open', value: 'registration' },
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
            admin: {
                description: 'Current status of the challenge',
                position: 'sidebar',
            },
        },
        // Challenge meal structure (fixed for 21-day challenges)
        {
            type: 'collapsible',
            label: 'Meal Structure',
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'mealsPerDay',
                    type: 'number',
                    defaultValue: 3,
                    admin: {
                        description: 'Number of meals per day (default: 3 = breakfast, lunch, dinner)',
                        readOnly: true,
                    },
                },
                {
                    name: 'daysPerWeek',
                    type: 'number',
                    defaultValue: 7,
                    admin: {
                        description: 'Number of days per week (default: 7)',
                        readOnly: true,
                    },
                },
                {
                    name: 'snacksPerWeek',
                    type: 'number',
                    defaultValue: 2,
                    admin: {
                        description: 'Number of snacks per week (1 per half-week)',
                        readOnly: true,
                    },
                },
            ],
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data }) => {
                // Auto-calculate endDate as startDate + 21 days
                if (data.startDate) {
                    const start = new Date(data.startDate)
                    const end = new Date(start)
                    end.setDate(end.getDate() + 20) // 21 days total (start + 20 more)
                    data.endDate = end.toISOString().split('T')[0]
                }
                return data
            },
        ],
    },
}
