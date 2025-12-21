import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import ChallengeMealSelectionClient from './ChallengeMealSelectionClient'

// Helper used in other pages (replicated here for simplicity or valid import if shared)
function groupMenuItems(items: any[]) {
    const grouped: Record<string, any[]> = {}
    items.forEach((item) => {
        const category = item.menu_item_id.category || 'main'
        if (!grouped[category]) {
            grouped[category] = []
        }
        grouped[category].push({ ...item.menu_item_id, id: item.menu_item_id.id })
    })
    return grouped
}

const categoryOrder = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'main', label: 'Meals' },
    { key: 'premium', label: 'Premium Meals' },
    { key: 'salad', label: 'Salads' },
    { key: 'snack', label: 'Snacks' },
    { key: 'dessert', label: 'Desserts' }
]

export default async function ChallengeMealSelectionPage() {
    const user = await getUser()

    if (!user) {
        redirect('/login?redirect=/challenges/meals')
    }

    const payload = await getPayload({ config })

    // Find active participation for this user
    // We need to find a participant record where status is 'registered' or 'active'
    const participation = await payload.find({
        collection: 'challenge-participants' as any,
        where: {
            and: [
                {
                    'customer.id': {
                        equals: user.id
                    }
                },
                {
                    or: [
                        { status: { equals: 'registered' } },
                        { status: { equals: 'active' } }
                    ]
                }
            ]
        },
        depth: 2, // get challenge details
        limit: 1
    })

    if (participation.totalDocs === 0) {
        // User is not in an active challenge, redirect to challenges list
        redirect('/challenges')
    }

    const participant = participation.docs[0]
    const challenge = participant.challenge as any // Typed as any due to depth/types

    // Fetch the current Weekly Menu (Active)
    const menuQuery = await payload.find({
        collection: 'weekly-menus',
        where: {
            status: {
                equals: 'active',
            },
        },
        limit: 1,
    })

    if (menuQuery.docs.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-2">No Menu Available</h1>
                    <p>The menu for this week hasn't been posted yet. Please check back later.</p>
                    <a href="/" className="text-brand-primary hover:underline mt-4 inline-block">Return Home</a>
                </div>
            </div>
        )
    }

    const activeMenu = menuQuery.docs[0]

    // Cast to any to bypass type check for now
    const menu = activeMenu as any

    // Helper to filter valid items
    const getValidItems = (items: any[]): any[] => {
        if (!items) return []
        return items.filter((item) => item && typeof item === 'object' && 'id' in item)
    }

    const mainFirst = getValidItems(menu.firstHalfMains)
    const saladFirst = getValidItems(menu.firstHalfSalads)
    const mainSecond = getValidItems(menu.secondHalfMains)
    const saladSecond = getValidItems(menu.secondHalfSalads)
    const breakfasts = getValidItems(menu.breakfasts)
    const snacks = getValidItems(menu.snacks)

    // Combine for display
    let firstHalfDocs = [...mainFirst, ...saladFirst, ...breakfasts, ...snacks]
    let secondHalfDocs = [...mainSecond, ...saladSecond, ...breakfasts, ...snacks]

    // Serialize to ensure plain objects
    firstHalfDocs = JSON.parse(JSON.stringify(firstHalfDocs))
    secondHalfDocs = JSON.parse(JSON.stringify(secondHalfDocs))

    // Group menu items by category for each half
    const groupDocs = (docs: any[]) => {
        return docs.reduce((acc, item) => {
            let category = item.category
            if (category === 'premium') category = 'main'
            if (category === 'dessert') category = 'snack'
            // Legacy breakfast handling if needed, though we cleaned up enum
            if (category === 'breakfast-small' || category === 'breakfast-large') category = 'breakfast'

            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(item)
            return acc
        }, {} as Record<string, any[]>)
    }

    const groupedFirstHalf = groupDocs(firstHalfDocs)
    const groupedSecondHalf = groupDocs(secondHalfDocs)

    return (
        <ChallengeMealSelectionClient
            groupedFirstHalf={groupedFirstHalf}
            groupedSecondHalf={groupedSecondHalf}
            categoryOrder={categoryOrder}
            challengeName={challenge.name}
            challengeId={challenge.id}
        />
    )
}
