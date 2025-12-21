import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'

export default async function ChallengeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const payload = await getPayload({ config })
    const { id } = await params

    let challenge
    try {
        challenge = await payload.findByID({
            collection: 'challenges' as any,
            id,
        })
    } catch (error) {
        return notFound()
    }

    // Fetch tiers for pricing table
    const tiers = await payload.find({
        collection: 'tiers',
        sort: 'single_price',
    })

    // Mock pricing logic: In a real scenario, we'd probably have challenge-specific pricing overridden per tier
    // or a multiplier. For now, let's assume the challenge `price` field is a base, or we display tier prices
    // multiplied by the number of meals (21 days * 3 meals = 63 meals + 6 snacks).
    //
    // *User Requirement*: "pricing per tier".
    // Let's display the tiers and calculate the cost based on the challenge duration?
    // Or just list the tiers and let user select one in registration.
    // The challenge collection has a 'price' field but user said "pricing per tier".
    // We'll calculate: Tier.single_price * (21 days * 3 meals) + snack cost?
    //
    // Let's assume for now we just show the tiers and a "Register" button that leads to selection.

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-brand-primary text-white py-16 md:py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-brand-primary text-sm font-bold mb-4 uppercase tracking-wider">
                        21-Day Transformation
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{challenge.name}</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
                        Commit to 21 days of clean eating and measurable progress.
                    </p>
                </div>
                {/* Abstract background shapes could go here */}
            </div>

            <div className="container mx-auto px-4 py-12 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                    {/* Challenge Info Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12 border-b border-gray-100 pb-12">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Duration</h3>
                            <p className="text-gray-600">
                                {new Date(challenge.startDate).toLocaleDateString()} - {challenge.endDate ? new Date(challenge.endDate).toLocaleDateString() : 'TBD'}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Meal Plan</h3>
                            <p className="text-gray-600">
                                3 Meals/Day + 2 Snacks/Week
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Results Tracking</h3>
                            <p className="text-gray-600">
                                2 Fit3D Body Scans Included
                            </p>
                        </div>
                    </div>

                    {/* Description & Features */}
                    <div className="prose max-w-none text-gray-600 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Challenge</h2>
                        {/* We'll just render simple text for now if richText rendering is complex without a helper, 
                or just omit if the description object structure is unknown. 
                Assuming we can just dump a placeholder text for now or render clean description.
             */}
                        <p>
                            Join a community of motivated individuals for 21 days of focused nutrition.
                            Our Registered Dietitian has curated a meal plan designed to fuel your body
                            and reset your habits.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">What's Included:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>63 Nutritious Meals</strong>: Breakfast, Lunch, and Dinner for every day of the challenge.</li>
                            <li><strong>6 Healthy Snacks</strong>: Curated snacks to keep you fueled (2 per week).</li>
                            <li><strong>Fit3D Body Scans ($50 Value)</strong>: One scan at the start and one at the end to visualize your transformation.</li>
                            <li><strong>Community Support</strong>: Join the cohort and stay accountable.</li>
                        </ul>
                    </div>

                    {/* Pricing Tiers */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Choose Your Tier</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {tiers.docs.map((tier: any) => {
                                // Find tier pricing in challenge definition
                                const tierPriceObj = (challenge.tierPricing || []).find((p: any) => {
                                    const tierId = typeof p.tier === 'object' ? p.tier.id : p.tier
                                    return tierId === tier.id
                                })
                                const price = tierPriceObj ? tierPriceObj.price : challenge.price

                                return (
                                    <div key={tier.id} className="border rounded-xl p-6 flex flex-col hover:border-brand-primary transition-colors hover:shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.tier_name}</h3>
                                        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{tier.description}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-brand-primary mb-2">
                                                    ${price}
                                                </p>
                                                <p className="text-xs text-gray-500">Total for 21 Days</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gray-50 rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform?</h2>
                        <p className="text-gray-600 mb-8">
                            Registration closes on {new Date(challenge.registrationDeadline).toLocaleDateString()}.
                            Spots are limited!
                        </p>
                        <Link
                            href={`/challenges/${challenge.id}/register`}
                            className="inline-block bg-brand-primary text-white font-bold py-4 px-12 rounded-full hover:bg-brand-dark transition-colors shadow-lg text-lg transform hover:scale-105"
                        >
                            Sign Up Now
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
