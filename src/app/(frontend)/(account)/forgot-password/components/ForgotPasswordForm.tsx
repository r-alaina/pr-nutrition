'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/CustomerForm/SubmitButton'
import { Input } from '@/components/CustomerForm/input'
import { FormContainer } from '@/components/CustomerForm/FormContainer'
import { ForgotPassword } from '../../forgot-password/actions/forgotPassword'
import { Response } from '@/app/(frontend)/(account)/create-account/actions/create'

export default function ForgotForm(): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string

    const result: Response = await ForgotPassword({ email })
    setIsLoading(false)

    if (result.success) {
      router.push(`/login?message=${encodeURIComponent('Check your email for a password reset link')}`)
    } else {
      setError(result.error || 'An error occurred.')
    }
  }

  return (
    <FormContainer heading="Forgot Password?">
      <div className="w-full mx-auto sm:max-w-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" required />
          {error && <div className="text-red-400">{error}</div>}
          <SubmitButton loading={isLoading} text="Reset password" />
        </form>
      </div>
    </FormContainer>
  )
}
