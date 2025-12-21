'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MenuItem } from '@/payload-types'
import { BreakfastIcon, MainIcon, SnackIcon, SaladIcon } from '../../components/CategoryIcons'

interface ChallengeMealSelectionClientProps {
    groupedFirstHalf: Record<string, MenuItem[]>
    groupedSecondHalf: Record<string, MenuItem[]>
    categoryOrder: Array<{ key: string; label: string }>
    challengeName: string
    challengeId: number
}

// Challenge Specific Limits
const LIMITS = {
    firstHalf: {
        breakfast: 3,
        main: 6,
        snack: 1
    },
    secondHalf: {
        breakfast: 4,
        main: 8,
        snack: 1
    }
}

// Helper to get card styles (Reused)
const getCardStyles = (category: string) => {
    switch (category) {
        case 'breakfast':
            return {
                borderColor: 'border-brand-orange',
                bgColor: 'bg-orange-50',
                textColor: 'text-brand-orange',
                buttonColor: 'bg-brand-orange',
                hoverColor: 'hover:bg-orange-600',
                lightBg: 'bg-orange-100',
                Icon: BreakfastIcon,
                iconColor: 'bg-brand-orange',
            }
        case 'snack':
        case 'dessert':
            return {
                borderColor: 'border-purple-500',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-600',
                buttonColor: 'bg-purple-600',
                hoverColor: 'hover:bg-purple-700',
                lightBg: 'bg-purple-100',
                Icon: SnackIcon,
                iconColor: 'bg-purple-500',
            }
        case 'salad':
            return {
                borderColor: 'border-green-500',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600',
                buttonColor: 'bg-green-600',
                hoverColor: 'hover:bg-green-700',
                lightBg: 'bg-green-100',
                Icon: SaladIcon,
                iconColor: 'bg-green-500',
            }
        default: // Main/Premium
            return {
                borderColor: 'border-brand-primary',
                bgColor: 'bg-green-50',
                textColor: 'text-brand-primary',
                buttonColor: 'bg-brand-primary',
                hoverColor: 'hover:bg-brand-dark',
                lightBg: 'bg-brand-primary/10',
                Icon: MainIcon,
                iconColor: 'bg-brand-primary',
            }
    }
}

export default function ChallengeMealSelectionClient({
    groupedFirstHalf,
    groupedSecondHalf,
    categoryOrder,
    challengeName,
    challengeId
}: ChallengeMealSelectionClientProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'firstHalf' | 'secondHalf'>('firstHalf')

    // State for selections
    const [selectedFirstHalfMeals, setSelectedFirstHalfMeals] = useState<{ meal: MenuItem; quantity: number }[]>([])
    const [selectedSecondHalfMeals, setSelectedSecondHalfMeals] = useState<{ meal: MenuItem; quantity: number }[]>([])

    // Counts helpers
    const getCounts = (half: 'firstHalf' | 'secondHalf') => {
        const items = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals

        const breakfast = items
            .filter(i => i.meal.category === 'breakfast')
            .reduce((sum, i) => sum + i.quantity, 0)

        const snack = items
            .filter(i => i.meal.category === 'snack' || i.meal.category === 'dessert')
            .reduce((sum, i) => sum + i.quantity, 0)

        // Mains are everything else (main, premium, salad, etc if salad counts as main in challenge - assuming yes)
        const main = items
            .filter(i => !['breakfast', 'snack', 'dessert'].includes(i.meal.category || ''))
            .reduce((sum, i) => sum + i.quantity, 0)

        return { breakfast, main, snack }
    }

    const counts_1 = getCounts('firstHalf')
    const counts_2 = getCounts('secondHalf')

    const isComplete = (half: 'firstHalf' | 'secondHalf') => {
        const c = half === 'firstHalf' ? counts_1 : counts_2
        const l = LIMITS[half]
        return c.breakfast === l.breakfast && c.main === l.main && c.snack === l.snack
    }

    const handleQuantityChange = (
        meal: MenuItem,
        newQty: number,
        half: 'firstHalf' | 'secondHalf'
    ) => {
        if (newQty < 0) return

        const setter = half === 'firstHalf' ? setSelectedFirstHalfMeals : setSelectedSecondHalfMeals
        const currentItems = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals

        // Check validation if increasing
        const currentItemQty = currentItems.find(i => i.meal.id === meal.id)?.quantity || 0
        if (newQty > currentItemQty) {
            // We are adding one
            const cat = meal.category || 'main'
            let type: 'breakfast' | 'main' | 'snack' = 'main'

            if (cat.includes('breakfast')) type = 'breakfast'
            else if (cat === 'snack' || cat === 'dessert') type = 'snack'

            const currentCount = getCounts(half)[type]
            const limit = LIMITS[half][type]

            if (currentCount >= limit) {
                alert(`You have reached the limit for ${type}s in the ${half === 'firstHalf' ? 'First' : 'Second'} Half.`)
                return
            }
        }

        setter(prev => {
            if (newQty === 0) return prev.filter(i => i.meal.id !== meal.id)

            const exists = prev.find(i => i.meal.id === meal.id)
            if (exists) {
                return prev.map(i => i.meal.id === meal.id ? { ...i, quantity: newQty } : i)
            }
            return [...prev, { meal, quantity: newQty }]
        })
    }

    const toggleMeal = (meal: MenuItem, half: 'firstHalf' | 'secondHalf') => {
        const currentItems = half === 'firstHalf' ? selectedFirstHalfMeals : selectedSecondHalfMeals
        const existing = currentItems.find(i => i.meal.id === meal.id)

        if (existing) {
            // Toggle off
            handleQuantityChange(meal, 0, half)
        } else {
            // Toggle on (add 1)
            handleQuantityChange(meal, 1, half)
        }
    }

    const handleSubmit = async () => {
        if (!isComplete('firstHalf') || !isComplete('secondHalf')) {
            alert('Please complete your meal selection for both halves according to the challenge rules.')
            return
        }

        if (!confirm('Are you sure you want to finalize your meal selection?')) return

        try {
            const response = await fetch('/api/challenges/submit-meals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    challengeId,
                    items: [
                        ...selectedFirstHalfMeals.map(i => ({ id: i.meal.id, quantity: i.quantity, half: 'firstHalf' })),
                        ...selectedSecondHalfMeals.map(i => ({ id: i.meal.id, quantity: i.quantity, half: 'secondHalf' }))
                    ]
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Submission failed')
            }

            // Redirect to success
            router.push('/challenges/complete')

        } catch (error: any) {
            console.error(error)
            alert(`Error: ${error.message}`)
        }
    }

    const groupedItems = activeTab === 'firstHalf' ? groupedFirstHalf : groupedSecondHalf

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* Header / Summary */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-gray-900">{challengeName} Meal Selection</h1>
                        <div className="text-sm text-gray-500">
                            <span className={isComplete('firstHalf') && isComplete('secondHalf') ? 'text-green-600 font-bold' : 'text-orange-500'}>
                                {isComplete('firstHalf') && isComplete('secondHalf') ? 'Selection Complete' : 'Incomplete'}
                            </span>
                        </div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* First Half Status */}
                        <div
                            onClick={() => setActiveTab('firstHalf')}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${activeTab === 'firstHalf' ? 'border-brand-primary bg-brand-primary/5' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}
                        >
                            <div className="flex justify-between text-sm font-bold mb-1">
                                <span>First Half (Mon-Wed)</span>
                                {isComplete('firstHalf') && <span className="text-green-600">✓ Done</span>}
                            </div>
                            <div className="flex gap-2 text-xs text-gray-600">
                                <span className={counts_1.breakfast === LIMITS.firstHalf.breakfast ? 'text-green-600' : ''}>B: {counts_1.breakfast}/{LIMITS.firstHalf.breakfast}</span>
                                <span className={counts_1.main === LIMITS.firstHalf.main ? 'text-green-600' : ''}>M: {counts_1.main}/{LIMITS.firstHalf.main}</span>
                                <span className={counts_1.snack === LIMITS.firstHalf.snack ? 'text-green-600' : ''}>S: {counts_1.snack}/{LIMITS.firstHalf.snack}</span>
                            </div>
                        </div>

                        {/* Second Half Status */}
                        <div
                            onClick={() => setActiveTab('secondHalf')}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${activeTab === 'secondHalf' ? 'border-brand-primary bg-brand-primary/5' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}
                        >
                            <div className="flex justify-between text-sm font-bold mb-1">
                                <span>Second Half (Thu-Sun)</span>
                                {isComplete('secondHalf') && <span className="text-green-600">✓ Done</span>}
                            </div>
                            <div className="flex gap-2 text-xs text-gray-600">
                                <span className={counts_2.breakfast === LIMITS.secondHalf.breakfast ? 'text-green-600' : ''}>B: {counts_2.breakfast}/{LIMITS.secondHalf.breakfast}</span>
                                <span className={counts_2.main === LIMITS.secondHalf.main ? 'text-green-600' : ''}>M: {counts_2.main}/{LIMITS.secondHalf.main}</span>
                                <span className={counts_2.snack === LIMITS.secondHalf.snack ? 'text-green-600' : ''}>S: {counts_2.snack}/{LIMITS.secondHalf.snack}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Render Menu Items (Simplified from Guest Client) */}
                {categoryOrder.map(({ key, label }) => {
                    const items = groupedItems[key] || []
                    if (items.length === 0) return null

                    return (
                        <div key={key} className="mb-12">
                            <h3 className="text-xl font-bold mb-6 border-l-4 border-brand-primary pl-3">{label}</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(item => {
                                    const styles = getCardStyles(item.category || 'main')
                                    const currentQty = activeTab === 'firstHalf'
                                        ? selectedFirstHalfMeals.find(i => i.meal.id === item.id)?.quantity || 0
                                        : selectedSecondHalfMeals.find(i => i.meal.id === item.id)?.quantity || 0
                                    const isSelected = currentQty > 0

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => !isSelected && toggleMeal(item, activeTab)}
                                            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md ${isSelected ? styles.borderColor : 'border-transparent'}`}
                                        >
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                    {isSelected && (
                                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => handleQuantityChange(item, currentQty - 1, activeTab)}
                                                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200"
                                                            >-</button>
                                                            <span className="font-bold">{currentQty}</span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item, currentQty + 1, activeTab)}
                                                                className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold hover:bg-brand-dark"
                                                            >+</button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                            </div>
                                            <div className={`px-4 py-2 ${styles.bgColor} text-xs font-bold ${styles.textColor} uppercase tracking-wider`}>
                                                {item.category}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Selection Progress</p>
                        <p className="font-bold text-gray-900">
                            {isComplete('firstHalf') && isComplete('secondHalf') ? 'All set!' : 'Selection incomplete'}
                        </p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!isComplete('firstHalf') || !isComplete('secondHalf')}
                        className={`px-8 py-3 rounded-full font-bold text-white transition-all transform ${isComplete('firstHalf') && isComplete('secondHalf') ? 'bg-brand-primary hover:scale-105' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    )
}
