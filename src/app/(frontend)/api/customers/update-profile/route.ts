import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

import type { Customer } from '@/payload-types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Get the current user
    const { user } = (await payload.auth({
      headers: new Headers({ cookie: `payload-token=${token}` }),
    })) as { user: Customer | null }

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, email } = body
    
    // Update the user's profile
    const updatedUser = await payload.update({
      collection: 'customers',
      id: user.id,
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
  }
}
