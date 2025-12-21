import type { CollectionConfig, FieldHook } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'
import { WeekSelectorField } from './components/WeekSelectorField'

// Helper to get last week's items for defaults
const getLastWeekItems = async (req: any, key: string) => {
    if (!req.payload) return []
    try {
        const lastMenu = await req.payload.find({
            collection: 'weekly-menus',
            where: {
                status: {
                    equals: 'active',
                },
            },
            sort: '-weekOf',
            limit: 1,
        })
        if (lastMenu.docs.length > 0) {
            const doc = lastMenu.docs[0] as any
            // Return the IDs
            if (doc[key] && Array.isArray(doc[key])) {
                // Handle if populated or just IDs
                return doc[key].map((item: any) => (typeof item === 'object' ? item.id : item))
            }
        }
    } catch (e) {
        // console.error('Error fetching last week defaults', e)
        return []
    }
    return []
}

// Helper to calculate the next Monday
const getNextMonday = () => {
    const today = new Date();
    const resultDate = new Date(today.getTime());
    const day = today.getDay(); // 0 (Sun) to 6 (Sat)
    // Calculate days until next Monday. 
    // If today is Monday(1), we want next Monday (+7).
    // If today is Sunday(0), we want tomorrow (+1).
    const daysUntilNextMonday = (1 + 7 - day) % 7 || 7;
    resultDate.setDate(today.getDate() + daysUntilNextMonday);
    return resultDate; // Payload handles Date objects
}

export const WeeklyMenu: CollectionConfig = {
    slug: 'weekly-menus',
    admin: {
        useAsTitle: 'weekOf',
        defaultColumns: ['weekOf', 'status'],
        group: 'Operations',
    },
    access: {
        read: () => true,
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
            type: 'tabs',
            tabs: [
                {
                    label: 'General',
                    fields: [
                        {
                            name: 'weekOf',
                            type: 'date',
                            required: true,
                            defaultValue: getNextMonday,
                            admin: {
                                components: {
                                    Field: WeekSelectorField as any,
                                },
                                description: 'Select the Monday of the week this menu is for.',
                            },
                        },
                        {
                            name: 'status',
                            type: 'select',
                            defaultValue: 'draft',
                            options: [
                                { label: 'Draft', value: 'draft' },
                                { label: 'Active', value: 'active' },
                                { label: 'Archived', value: 'archived' },
                            ],
                            required: true,
                        },
                    ],
                },
                {
                    label: 'First Half (Sun/Mon)',
                    fields: [
                        {
                            name: 'firstHalfMains',
                            label: 'Lunch / Dinner (Select ~3)',
                            type: 'relationship',
                            relationTo: 'menu-items',
                            hasMany: true,
                            filterOptions: {
                                active: { equals: true },
                                category: { in: ['main', 'premium'] },
                            },
                        },
                        {
                            name: 'firstHalfSalads',
                            label: 'Salads',
                            type: 'relationship',
                            relationTo: 'menu-items',
                            hasMany: true,
                            filterOptions: {
                                active: { equals: true },
                                category: { equals: 'salad' },
                            },
                            defaultValue: async ({ req }: any) => getLastWeekItems(req, 'firstHalfSalads'),
                        },
                    ],
                },
                {
                    label: 'Second Half (Wed/Thu)',
                    fields: [
                        {
                            name: 'secondHalfMains',
                            label: 'Lunch / Dinner (Select ~4)',
                            type: 'relationship',
                            relationTo: 'menu-items',
                            hasMany: true,
                            filterOptions: {
                                active: { equals: true },
                                category: { in: ['main', 'premium'] },
                            },
                        },
                        {
                            name: 'secondHalfSalads',
                            label: 'Salads',
                            type: 'relationship',
                            relationTo: 'menu-items',
                            hasMany: true,
                            filterOptions: {
                                active: { equals: true },
                                category: { equals: 'salad' },
                            },
                            defaultValue: async ({ req }: any) => getLastWeekItems(req, 'secondHalfSalads'),
                        },
                    ],
                },
                {
                    label: 'Recurring / All Week',
                    fields: [
                        {
                            name: 'breakfasts',
                            label: 'Breakfasts',
                            type: 'relationship',
                            relationTo: 'menu-items',
                            hasMany: true,
                            filterOptions: {
                                active: { equals: true },
                                category: { equals: 'breakfast' },
                            },
                            defaultValue: async ({ req }: any) => getLastWeekItems(req, 'breakfasts'),
                        },
                        {
                            name: 'snacks',
                            label: 'Snacks',
                            type: 'relationship',
                            relationTo: 'menu-items',
                            hasMany: true,
                            filterOptions: {
                                active: { equals: true },
                                category: { equals: 'snack' },
                            },
                            defaultValue: async ({ req }: any) => getLastWeekItems(req, 'snacks'),
                        },
                    ],
                },
            ],
        },
    ],
    hooks: {
        afterChange: [
            async ({ doc, req }) => {
                if (doc.status === 'active') {
                    // Find other active menus
                    const others = await req.payload.find({
                        collection: 'weekly-menus',
                        where: {
                            status: { equals: 'active' },
                            id: { not_equals: doc.id },
                        },
                    })
                    // Archive them
                    if (others.docs.length > 0) {
                        await Promise.all(
                            others.docs.map(async (other) => {
                                await req.payload.update({
                                    collection: 'weekly-menus',
                                    id: other.id,
                                    data: { status: 'archived' },
                                })
                            }),
                        )
                    }
                }
            },
        ],
    },
}
