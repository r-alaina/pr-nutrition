'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

interface CreateAdminParams {
  email: string
  password: string
}

export interface AdminSignupResponse {
  success: boolean
  error?: string
}

export async function createAdmin({
  email,
  password,
}: CreateAdminParams): Promise<AdminSignupResponse> {
  // initialize Payload
  const payload = await getPayload({ config })

  try {
    // Check if user with this email already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    // Check if customer with this email exists
    const existingCustomer = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existingUser.totalDocs > 0 || existingCustomer.totalDocs > 0) {
      return { success: false, error: 'An account with this email already exists' }
    }

    // Create admin user with 'admin' role (full privileges)
    try {
      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          roles: ['admin'], // Full admin privileges
          active: true,
        },
      })

      return { success: true }
    } catch (e: unknown) {
      console.log('Admin signup error: ', e)
      const message = e instanceof Error ? e.message : String(e)
      // Handle specific Payload errors
      if (message.includes('email')) {
        return { success: false, error: 'Invalid email address' }
      }
      if (message.includes('password')) {
        return { success: false, error: 'Password does not meet requirements' }
      }
      return { success: false, error: 'There was a problem creating your account' }
    }
  } catch (e) {
    console.log('Signup error: ', e)
    return { success: false, error: 'An error occurred' }
  }
}
