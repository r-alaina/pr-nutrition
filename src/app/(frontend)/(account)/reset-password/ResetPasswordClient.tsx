'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword } from './action'

export default function ResetPasswordClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!token) {
            setError('Missing reset token.')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        setStatus('loading')
        setError('')

        const res = await resetPassword({ token, password })

        if (res.success) {
            setStatus('success')
            setTimeout(() => {
                router.push('/login?message=password_reset')
            }, 3000)
        } else {
            setStatus('error')
            setError(res.error || 'Something went wrong.')
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h1>
                    <p className="text-gray-600 mb-4">This password reset link is invalid or missing a token.</p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="text-[#5CB85C] hover:underline"
                    >
                        Request a new link
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Reset Password</h1>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-4">
                            Password reset successfully! Redirecting to login...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-gray-600">Enter your new password below.</p>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent"
                                placeholder="New password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-[#5CB85C] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#4A9A4A] transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
