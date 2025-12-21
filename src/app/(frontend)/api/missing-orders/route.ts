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
            depth: 0,
        })

        // 4. Create Set of Customer IDs who HAVE ordered
        const orderingCustomerIds = new Set(
            orders.docs.map(o => typeof o.customer === 'object' ? o.customer.id : o.customer)
        )

        // 5. Filter for Missing & Active Cycle
        const today = new Date()
        const missingCustomers = customers.docs
            .filter(c => {
                // If they have ordered, they are not missing
                if (orderingCustomerIds.has(c.id)) return false

                // Check if Cycle is still active (within 28 days of start date)
                // If cycle_start_date is missing, we fallback to createdAt or assume active
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cycleStartDate = (c as any).cycle_start_date
                const cycleStart = cycleStartDate ? new Date(cycleStartDate) : new Date(c.createdAt)

                // Calculate difference in days
                const diffTime = Math.abs(today.getTime() - cycleStart.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                console.log(`Checking ${c.email}: CycleStart=${cycleStart.toISOString()}, DiffDays=${diffDays}`)

                // If cycle started more than 28 days ago, they are "expired" and shouldn't be expected to order
                // Note: User requests "current date <= 28 days from cycle_start_date"
                // So if diffDays > 28, we EXCLUDE them (return false)
                if (diffDays > 28) return false

                return true
            })
            .map(c => ({
                id: c.id,
                name: c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.email,
                email: c.email,
                planType: c.subscription_frequency || 'Unknown',
                credits: c.plan_credits || c.credit_balance || 0,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                phone: (c as any).phone || 'No phone',
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
