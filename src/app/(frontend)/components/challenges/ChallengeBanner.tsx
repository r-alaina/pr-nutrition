import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function ChallengeBanner() {
    const payload = await getPayload({ config })

    // Find upcoming or registration-open challenges
    const challenges = await payload.find({
        collection: 'challenges' as any,
        where: {
            or: [
                {
                    status: {
                        equals: 'registration',
                    },
                },
                {
                    status: {
                        equals: 'upcoming',
                    },
                },
            ],
        },
        sort: 'startDate',
        limit: 1,
    })

    // If no active challenges, return null
    if (!challenges.docs.length) {
        return null
    }

    const challenge = challenges.docs[0]
    const isRegistrationOpen = challenge.status === 'registration'

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 relative overflow-hidden">
            {/* Background pattern/effect can go here */}
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 relative z-10">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full mb-1">
                        {isRegistrationOpen ? 'Registration Open Now!' : 'Coming Soon'}
                    </span>
                    <p className="font-medium text-lg sm:text-xl">
                        Join the <span className="font-bold text-yellow-300">{challenge.name}</span>
                    </p>
                    <p className="text-sm text-blue-100 hidden sm:block">
                        Take on the 21-Day Challenge and transform your habits!
                    </p>
                </div>

                <Link
                    href={`/challenges/${challenge.id}`}
                    className="whitespace-nowrap bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                    {isRegistrationOpen ? 'Join Challenge' : 'View Details'}
                </Link>
            </div>
        </div>
    )
}
