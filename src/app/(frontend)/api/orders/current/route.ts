import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('payload-token')?.value

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
        }

        const payload = await getPayload({ config })
        const { user } = await payload.auth({
            headers: new Headers({ cookie: `payload-token=${token}` }),
        })

        if (!user) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
        }

        // Determine current week
        const today = new Date()
        const currentDay = today.getDay()
        const daysToLastSunday = currentDay === 0 ? 0 : currentDay
        const weekOfDate = new Date(today)
        weekOfDate.setDate(today.getDate() - daysToLastSunday)
        weekOfDate.setHours(0, 0, 0, 0)

        const orders = await payload.find({
            collection: 'orders',
            where: {
                and: [
                    { customer: { equals: user.id } },
                    { weekOf: { equals: weekOfDate.toISOString() } },
                    { status: { not_equals: 'cancelled' } },
                ],
            },
            depth: 2, // Get menu item details
        })

        if (orders.totalDocs === 0) {
            return NextResponse.json({ order: null })
        }

        return NextResponse.json({ order: orders.docs[0] })
    } catch (error) {
        console.error('Error fetching current order:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
