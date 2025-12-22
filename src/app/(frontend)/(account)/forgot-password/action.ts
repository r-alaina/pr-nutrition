'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const payload = await getPayload({ config })
    try {
        await payload.forgotPassword({
            collection: 'customers',
            data: {
                email,
            },
            disableEmail: false, // Ensure email is sent
        })
        return { success: true }
    } catch (error) {
        console.error('Forgot Password error:', error)
        // Always return success to prevent email enumeration, or return specific error if needed and safe
        // For type safety, we allow error to be part of the return type, even if we don't currently use it for security reasons
        return { success: true }
    }
}
