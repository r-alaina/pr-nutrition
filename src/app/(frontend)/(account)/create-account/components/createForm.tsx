'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import { create, type Response } from '@/app/(frontend)/(account)/create-account/actions/create'
import { FormContainer } from '@/components/CustomerForm/FormContainer'
import { Input } from '@/components/CustomerForm/input'
import SubmitButton from '@/components/CustomerForm/SubmitButton'
import Link from 'next/link'

export default function CreateForm(): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const result: Response = await create({ email, password, firstName, lastName })
    setIsLoading(false)

    if (result.success) {
      router.push(`/login?message=${encodeURIComponent('Check your email to verify your account')}`)
    } else {
      setError(result.error || 'An error occurred.')
    }
  }

  return (
    <FormContainer heading="Create an account">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-row gap-2">
          <Input label="First Name" name="firstName" type="text" required />
          <Input label="Last Name" name="lastName" type="text" />
        </div>

        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
        />

        {error && <div className="text-red-400">{error}</div>}

        <SubmitButton loading={isLoading} text="Create account" />
      </form>

      <div className="mt-4 text-sm text-emerald-950/60">
        Already have an account?{' '}
        <Link href="/login" className="underline underline-offset-4">
          Login here.
        </Link>
      </div>
    </FormContainer>
  )
}
