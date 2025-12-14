import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Get the current user
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `payload-token=${token}` }),
    })

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    // Get orders for this customer
    const orders = await payload.find({
      collection: 'orders',
      where: {
        customer: {
          equals: user.id,
        },
      },
      sort: '-createdAt', // Most recent first
      depth: 2, // Populate relationships
      limit: 100, // Limit to 100 most recent orders
    })

    return NextResponse.json({
      orders: orders.docs,
    })
  } catch (error) {
    console.error('Error getting user orders:', error)
    return NextResponse.json({ message: 'Failed to get orders' }, { status: 500 })
  }
}
