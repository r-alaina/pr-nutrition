'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Tier {
    id: number
    tier_name: string
    description?: string | null
    single_price?: number | null
    // add other fields as needed
}

interface Challenge {
    id: number
    name: string
    price: number
    tierPricing?: {
        tier: number | { id: number }
        price: number
    }[]
    startDate: string
    endDate: string
}

interface User {
    id: number
    email: string
    name?: string
}

interface Props {
    challenge: Challenge
    tiers: Tier[]
    user: User
}

export default function ChallengeRegistrationForm({ challenge, tiers, user }: Props) {
    const router = useRouter()
    const [selectedTierId, setSelectedTierId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Calculate total price based on selected tier or base price
    const getPrice = () => {
        if (!selectedTierId) return challenge.price

        const tierPriceObj = (challenge.tierPricing || []).find((p: any) => {
            const tierId = typeof p.tier === 'object' ? p.tier.id : p.tier
            return tierId === selectedTierId
        })

        return tierPriceObj ? tierPriceObj.price : challenge.price
    }

    const totalPrice = getPrice()

    const handleSubmit = async () => {
        if (!selectedTierId) {
            setError('Please select a tier to continue.')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            // Call API to create participant record
            // We need a new server action or API route for this.
            // For now, let's assume valid success mocks payment entry.

            const res = await fetch('/api/challenges/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    challengeId: challenge.id,
                    tierId: selectedTierId,
                    userId: user.id
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || 'Registration failed')
            }

            // Redirect to success / payment / meals
            router.push('/challenges/meals?new=true')

        } catch (err: any) {
            setError(err.message)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`
                            cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md
                            ${selectedTierId === tier.id
                                ? 'border-brand-primary bg-green-50/30 ring-1 ring-brand-primary'
                                : 'border-gray-200 hover:border-brand-primary/50'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900">{tier.tier_name}</h3>
                            {selectedTierId === tier.id && (
                                <div className="bg-brand-primary text-white p-1 rounded-full">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{tier.description}</p>

                        {(() => {
                            const tierPriceObj = (challenge.tierPricing || []).find((p: any) => {
                                const tierId = typeof p.tier === 'object' ? p.tier.id : p.tier
                                return tierId === tier.id
                            })
                            const price = tierPriceObj ? tierPriceObj.price : challenge.price
                            return (
                                <p className="text-lg font-bold text-brand-primary">
                                    ${price}
                                </p>
                            )
                        })()}
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500">Total Program Cost</p>
                        <p className="text-3xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">Includes 21 days of meals + 2 Fit3D scans</p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedTierId}
                        className={`
                            px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all transform
                            ${isSubmitting || !selectedTierId
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100 placeholder-opacity-100'
                                : 'bg-brand-primary text-white hover:bg-brand-dark hover:scale-105'
                            }
                        `}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
    )
}
