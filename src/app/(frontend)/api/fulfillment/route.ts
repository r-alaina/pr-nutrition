import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

interface PackingSlipItem {
    mealName: string
    quantity: number
    category: string
}

interface PackingSlip {
    orderNumber: string
    customerName: string
    customerEmail: string
    tierName: string
    weekHalf: string
    pickupDate?: string
    status: string
    items: PackingSlipItem[]
    allergies?: string[]
    notes?: string
}

export async function GET(request: NextRequest) {
    try {
        const payload = await getPayload({ config })
        const { searchParams } = new URL(request.url)
        const weekHalf = searchParams.get('weekHalf') || undefined

        const orderQuery: Where = {
            status: {
                in: ['confirmed', 'preparing', 'ready', 'pending'],
            },
        }

        if (weekHalf) {
            orderQuery.weekHalf = {
                in: [weekHalf, 'both'],
            }
        }

        const orders = await payload.find({
            collection: 'orders',
            where: orderQuery,
            limit: 1000,
            depth: 2,
        })

        if (!orders || !orders.docs) {
            return NextResponse.json([])
        }

        const packingSlips: PackingSlip[] = orders.docs.map((order: any) => {
            // Format Customer
            const customer = order.customer
            const customerName =
                typeof customer === 'object'
                    ? (customer.firstName && customer.lastName
                        ? `${customer.firstName} ${customer.lastName}`
                        : customer.email)
                    : 'Unknown'

            const allergies = (typeof customer === 'object' && Array.isArray(customer.allergies))
                ? customer.allergies
                : []

            // Format Tier
            const tierName = typeof order.tier === 'object' ? order.tier.tier_name : 'Unknown'

            // Filter items for this weekHalf
            // If the order spans 'both', we technically fulfill for the specific half we are viewing
            // BUT if the item itself is tagged with a specific weekHalf, respect that.
            const items: PackingSlipItem[] = (order.orderItems || [])
                .filter((item: any) => {
                    if (!weekHalf) return true
                    // logic: if item has weekHalf, match it. If item is 'both', always show?
                    // If order is 'both', item might be 'firstHalf' or 'secondHalf'
                    return !item.weekHalf || item.weekHalf === weekHalf || item.weekHalf === 'both'
                })
                .map((item: any) => {
                    const menuItem = item.menuItem
                    const mealName = typeof menuItem === 'object' ? menuItem.name : 'Unknown'
                    const category = typeof menuItem === 'object' ? menuItem.category : ''
                    return {
                        mealName,
                        quantity: item.quantity,
                        category
                    }
                })
                .filter((item: PackingSlipItem) => item.quantity > 0)

            return {
                orderNumber: order.orderNumber,
                customerName,
                customerEmail: typeof customer === 'object' ? customer.email : '',
                tierName,
                weekHalf: order.weekHalf,
                status: order.status,
                pickupDate: order.pickupDate, // Logic for pickup date might need calc if not stored
                items,
                allergies,
                notes: order.notes
            }
        })

        // Sort by Customer Name
        packingSlips.sort((a, b) => a.customerName.localeCompare(b.customerName))

        return NextResponse.json(packingSlips)

    } catch (error) {
        console.error('Error fetching fulfillment data:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
