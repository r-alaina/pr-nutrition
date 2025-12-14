import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get all tiers from the database
    const tiers = await payload.find({
      collection: 'tiers',
      limit: 100, // Get all tiers
    })

    return NextResponse.json(tiers)
  } catch (error) {
    console.error('Error fetching tiers:', error)
    return NextResponse.json({ message: 'Failed to fetch tiers' }, { status: 500 })
  }
}
