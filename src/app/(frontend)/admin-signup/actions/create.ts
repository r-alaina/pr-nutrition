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

    // Create admin user with 'user' role (default)
    // Admins can promote to 'admin' or 'editor' role later
    try {
      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          // Email field name might be different, let me check payload structure
          roles: ['user'], // Default to 'user' role, admins can upgrade later
          active: true,
        },
      })

      return { success: true }
    } catch (e: any) {
      console.log('Admin signup error: ', e)
      // Handle specific Payload errors
      if (e?.message?.includes('email')) {
        return { success: false, error: 'Invalid email address' }
      }
      if (e?.message?.includes('password')) {
        return { success: false, error: 'Password does not meet requirements' }
      }
      return { success: false, error: 'There was a problem creating your account' }
    }
  } catch (e) {
    console.log('Signup error: ', e)
    return { success: false, error: 'An error occurred' }
  }
}
