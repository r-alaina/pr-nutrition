'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

interface CreateParams {
  email: string
  password: string
  name: string
}

export interface Response {
  success: boolean
  error?: string
}

export async function create({ email, password, name }: CreateParams): Promise<Response> {
  // initialize Payload
  const payload = await getPayload({ config })

  try {
    // try finding a customer with the provided email
    const find = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    // if no customer exists for that email
    if (find.totalDocs === 0) {
      // try creating the customer
      try {
        await payload.create({
          collection: 'customers',
          data: {
            email,
            password,
            name,
          },
        })
        // and return success: true if the try succeeds
        return { success: true }
      } catch (e) {
        // otherwise catch the error and send a generic error message
        console.log(e)
        return { success: false, error: 'There was a problem creating account' }
      }
    } else {
      // if the account does exist (find.totalDocs > 0), return that message and don't create a new account
      return { success: false, error: 'Account already exists' }
    }
  } catch (e) {
    // Otherwise, throw a generic error.
    console.log('Signup error: ', e)
    return { success: false, error: 'An error occurred' }
  }
}
