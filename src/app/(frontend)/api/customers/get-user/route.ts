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

    // Get the full user data with populated relationships
    const fullUser = await payload.findByID({
      collection: 'customers',
      id: user.id,
      depth: 2, // This will populate relationships
    })

    return NextResponse.json({
      user: fullUser,
    })
  } catch (error) {
    console.error('Error getting user:', error)
    return NextResponse.json({ message: 'Failed to get user' }, { status: 500 })
  }
}
