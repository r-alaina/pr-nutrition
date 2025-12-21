import { getPayload } from 'payload'
import config from '@/payload.config'
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const user = await getUser()
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    try {
        const body = await req.json()
        const { challengeId, items } = body

        if (!challengeId || !items || !Array.isArray(items)) {
            return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
        }

        // 1. Verify Participation
        const participationQuery = await payload.find({
            collection: 'challenge-participants' as any,
            where: {
                and: [
                    { 'customer.id': { equals: user.id } },
                    { 'challenge': { equals: challengeId } },
                    { or: [{ status: { equals: 'registered' } }, { status: { equals: 'active' } }] }
                ]
            },
            depth: 1,
            limit: 1
        })

        if (participationQuery.totalDocs === 0) {
            return NextResponse.json({ message: 'Participant record not found or inactive' }, { status: 403 })
        }

        const participant = participationQuery.docs[0]
        const challenge: any = (typeof participant.challenge === 'object') ? participant.challenge : null // Need challenge full object

        // If challenge was not populated (depth check), fetch it
        let challengeDoc = challenge
        if (!challenge || !challenge.startDate) {
            challengeDoc = await payload.findByID({
                collection: 'challenges' as any,
                id: (typeof participant.challenge === 'object' ? participant.challenge.id : participant.challenge) as any
            })
        }

        // 2. Fetch Active Menu to determine Week Number
        const menuQuery = await payload.find({
            collection: 'weekly-menus',
            where: { status: { equals: 'active' } },
            limit: 1
        })

        if (menuQuery.totalDocs === 0) {
            return NextResponse.json({ message: 'No active menu found' }, { status: 404 })
        }

        const activeMenu = menuQuery.docs[0]
        const menuDate = new Date(activeMenu.weekOf)
        const challengeStartDate = new Date(challengeDoc.startDate)

        // Calculate week number (1-based index)
        const diffTime = menuDate.getTime() - challengeStartDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        // If menuDate is same as start (0 diff), it's week 1. If 7 days later, week 2.
        // Allowing for some flexibility (e.g. menu posted a day early?) - using simple division
        let weekNumber = Math.floor(diffDays / 7) + 1

        // Clamp or Validate
        if (weekNumber < 1) weekNumber = 1 // Assuming early selection is for week 1
        if (weekNumber > 3) weekNumber = 3 // Cap at 3 for 21-day challenge? Or allow overrun if prolonged?

        // Check if already completed this week?
        const alreadyCompleted = (participant.weeksCompleted || []).some((w: any) => w.weekNumber === weekNumber)
        if (alreadyCompleted) {
            // Optional: allow overwrite? For now, prevent dupes to avoid extra orders
            // return NextResponse.json({ message: 'Meal selection for this week already submitted' }, { status: 409 })
            // Actually, let's allow it but warn? Or just create a new order (amendment)?
            // Simple version: Create new order.
        }

        // 3. Prepare Order Items
        const orderItems = items.map((item: any) => ({
            menuItem: item.id,
            quantity: item.quantity,
            weekHalf: item.half, // 'firstHalf' or 'secondHalf' passed from client
            unitPrice: 0, // Included in challenge
            totalPrice: 0
        }))

        // 4. Create Order
        const order = await payload.create({
            collection: 'orders',
            data: {
                orderNumber: `CH${challengeId}-W${weekNumber}-${user.id}-${Date.now().toString().slice(-4)}`, // Unique ID
                customer: user.id,
                status: 'confirmed', // Prepaid
                items: orderItems, // Wait, Orders collection uses 'orderItems' array, not 'items'
                orderItems: orderItems,
                weekHalf: 'both',
                subtotal: 0,
                taxAmount: 0,
                totalAmount: 0,
                challengeId: challengeId,
                challengeWeek: weekNumber,
                isCreditUsed: false,
                // paymentStatus: 'paid' // Removed as it's not in schema
            } as any
        })

        // 5. Update Challenge Participant
        const newWeeksCompleted = [
            ...(participant.weeksCompleted || []),
            {
                weekNumber: weekNumber,
                orderId: order.id
            }
        ]

        await payload.update({
            collection: 'challenge-participants' as any,
            id: participant.id,
            data: {
                weeksCompleted: newWeeksCompleted
            }
        })

        return NextResponse.json({ success: true, orderId: order.id, weekNumber })

    } catch (error: any) {
        console.error('Submit Meals Error:', error)
        try {
            // Attempt to return JSON error
            return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
        } catch (e) {
            // Fallback
            return new NextResponse('Internal Server Error', { status: 500 })
        }
    }
}
