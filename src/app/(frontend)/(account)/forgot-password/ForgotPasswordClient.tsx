'use client'

import React, { useState } from 'react'
import { forgotPassword } from './action'

export default function ForgotPasswordClient() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('loading')
        setError('')

        const res = await forgotPassword(email)

        if (res.success) {
            setStatus('success')
        } else {
            setStatus('error')
            setError(res.error || 'Something went wrong.')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password?</h1>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-4">
                            Check your email for a link to reset your password.
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-gray-600">
                            Enter your email address and we will send you a link to reset your password.
                        </p>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-[#5CB85C] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#4A9A4A] transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
