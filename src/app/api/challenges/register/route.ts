import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
    try {
        const payload = await getPayload({ config })
        const body = await req.json()
        const { challengeId, tierId, userId } = body

        if (!challengeId || !tierId || !userId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        // Verify challenge exists and is open
        const challenge = await payload.findByID({
            collection: 'challenges' as any, // Cast until types gen
            id: challengeId,
        })

        if (!challenge || (challenge.status !== 'registration' && challenge.status !== 'upcoming')) {
            return NextResponse.json({ message: 'Challenge is not open for registration' }, { status: 400 })
        }

        // Create participant
        const participant = await payload.create({
            collection: 'challenge-participants' as any,
            data: {
                challenge: challengeId,
                customer: userId,
                tier: tierId,
                status: 'registered',
                paymentStatus: 'pending', // Payment flow to be implemented
                registeredAt: new Date().toISOString(),
            }
        })

        return NextResponse.json({
            message: 'Registration successful',
            participantId: participant.id
        }, { status: 201 })

    } catch (error: any) {
        console.error('Registration Error:', error)
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 })
    }
}
