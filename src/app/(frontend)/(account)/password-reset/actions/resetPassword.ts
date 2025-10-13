'use server'

import {getPayload} from 'payload'
import config from '@/payload.config'
import {Response} from '@/app/(frontend)/(account)/create-account/actions/create'

export interface ResetPasswordParams {
    token: string,
    password: string,
}

export async function resetPassword({token, password}: ResetPasswordParams): Promise<Response> {
    const payload = await getPayload({ config })

    try {
        await payload.resetPassword({
            collection: 'customers',
            data: {token,password},
            overrideAccess: true,
        })
    }
    catch (e) {
        console.log('Reset password error: ', e)
        return { success: false, error: 'There was a problem resetting the password' }
    }
    return { success: true }
}