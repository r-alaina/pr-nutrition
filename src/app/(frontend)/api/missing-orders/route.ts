import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const payload = await getPayload({ config })

        // 1. Get the current active Weekly Menu to determine the "Week Of" date
        const weeklyMenus = await payload.find({
            collection: 'weekly-menus',
            where: {
                status: { equals: 'active' },
            },
            limit: 1,
        })

        if (!weeklyMenus.docs.length) {
            return NextResponse.json({
                error: 'No active menu found',
                missingOrders: []
            })
        }

        const currentMenu = weeklyMenus.docs[0]
        const currentWeekOf = currentMenu.weekOf

        // 2. Fetch all Active Customers with Monthly Plan
        // "This should only be for customers with an active (monthly) plan."
        const customers = await payload.find({
            collection: 'customers',
            where: {
                and: [
                    { active: { equals: true } },
                    { subscription_frequency: { equals: 'monthly' } }
                ]
            },
            limit: 1000,
        })

        // 3. Fetch all Orders for this week
        const orders = await payload.find({
            collection: 'orders',
            where: {
                weekOf: { equals: currentWeekOf },
                status: { not_in: ['cancelled'] },
            },
            limit: 2000,
            depth: 0, // We only need customer IDs
        })

        // 4. Create Set of Customer IDs who HAVE ordered
        const orderingCustomerIds = new Set(
            orders.docs.map(o => typeof o.customer === 'object' ? o.customer.id : o.customer)
        )

        // 5. Filter for Missing
        const missingCustomers = customers.docs
            .filter(c => !orderingCustomerIds.has(c.id))
            .map(c => ({
                id: c.id,
                name: c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.email,
                email: c.email,
                planType: c.subscription_frequency || 'Unknown',
                credits: c.plan_credits || c.credit_balance || 0, // Prefer plan_credits
                phone: c.phone || 'No phone',
            }))

        return NextResponse.json({
            weekOf: currentWeekOf,
            missingCount: missingCustomers.length,
            customers: missingCustomers
        })

    } catch (error) {
        console.error('Error fetching missing orders:', error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
