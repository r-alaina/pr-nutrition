'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function forgotPassword(email: string) {
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
        return { success: true }
    }
}
