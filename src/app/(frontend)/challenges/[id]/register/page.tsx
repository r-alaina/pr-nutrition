import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import Link from 'next/link'

// We will likely need a client component for the form itself
import ChallengeRegistrationForm from './ChallengeRegistrationForm'

export default async function ChallengeRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getUser()

    // If no user, redirect to login with return url
    if (!user) {
        redirect(`/login?redirect=/challenges/${id}/register`)
    }

    const payload = await getPayload({ config })

    let challenge
    try {
        challenge = await payload.findByID({
            collection: 'challenges' as any,
            id,
        })
    } catch (error) {
        return notFound()
    }

    // Check if already registered?
    // Use 'count' to see if a participant record exists for this user + challenge
    const existingParticipant = await payload.find({
        collection: 'challenge-participants' as any,
        where: {
            and: [
                {
                    'challenge.id': {
                        equals: id
                    }
                },
                {
                    'customer.id': {
                        equals: user.id
                    }
                }
            ]
        }
    })

    // If already registered, redirect to dashboard or meal selection
    if (existingParticipant.totalDocs > 0) {
        // TODO: Redirect to meal selection or status page
        redirect(`/challenges/meals`)
    }

    // Fetch tiers for selection
    const tiers = await payload.find({
        collection: 'tiers',
        sort: 'single_price',
    })

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href={`/challenges/${id}`} className="text-gray-500 hover:text-brand-primary flex items-center mb-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Challenge Details
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Register for {challenge.name}</h1>
                    <p className="text-gray-600 mt-2">
                        Step 1: Select your nutritional tier.
                        Prices include 21 days of meals (63 total), 6 snacks, and 2 Fit3D scans.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <ChallengeRegistrationForm
                        challenge={challenge}
                        tiers={tiers.docs}
                        user={user}
                    />
                </div>
            </div>
        </div>
    )
}
