'use client'

import Link from 'next/link'

export default function ChallengeSelectionComplete() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-lg w-full">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Selection Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Your meals for this week have been saved. Our kitchen will get to work preparing them for you.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/challenges"
                        className="block w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors"
                    >
                        Back to Challenges
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
