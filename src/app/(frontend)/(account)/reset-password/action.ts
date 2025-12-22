'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

type ResetPasswordParams = {
    token: string
    password: string
}

export async function resetPassword({ token, password }: ResetPasswordParams) {
    const payload = await getPayload({ config })
    try {
        const user = await payload.resetPassword({
            collection: 'customers',
            data: {
                token,
                password,
            },
            overrideAccess: true,
        })

        if (user) {
            return { success: true }
        }
        return { success: false, error: 'Invalid token or error resetting password.' }
    } catch (error) {
        console.error('Reset Password error:', error)
        return { success: false, error: 'Failed to reset password. The link may have expired.' }
    }
}
