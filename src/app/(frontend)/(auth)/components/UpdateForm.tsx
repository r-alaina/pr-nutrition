'use client'  
  
import React, { ReactElement, useState } from 'react'  
import { useRouter } from 'next/navigation'  
import SubmitButton from '@/components/CustomerForm/SubmitButton'  
import {Input} from '@/components/CustomerForm/input'  
import {update} from '../actions/update'
import {Response} from '@/app/(frontend)/(account)/create-account/actions/create' 
import type { Customer } from '@/payload-types'  
import { FormContainer } from '@/components/CustomerForm/FormContainer'

export default function UpdateForm({ user, tiers }: { user: Customer, tiers: Customer['tier'][] }): ReactElement {  
  const [isLoading, setIsLoading] = useState(false)  
  const [error, setError] = useState<string | null>(null)  
  const router = useRouter()  
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {  
    event.preventDefault()  
    setIsLoading(true)  
    setError(null)  
  
  
    const formData = new FormData(event.currentTarget)  
  
    const email = formData.get('email') as string  
    const firstName = formData.get('firstName') as string  
    const lastName = formData.get('lastName') as string  
  
    const result: Response = await update({ email, lastName, firstName })  
  
    setIsLoading(false)  
  
    if (result.success) {  
      router.push('/dashboard')  
    } else {  
      setError(result.error || 'An error occurred.')  
    }  
  }  
  
  return <FormContainer heading={'Your Account'}>
      <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>  
        <div className={`flex flex-row flex-1/2 gap-2`}>  
          <Input label={'First Name'} name={'firstName'} type={'text'} defaultValue={user.firstName || ``} />  
          <Input label={'Last Name'} name={'lastName'} type={'text'} defaultValue={user.lastName || ``} />  
        </div>  
        <Input label={'Email'} name={'email'} type={'email'} defaultValue={user.email} />  
        <fieldset className={`flex flex-wrap gap-4 justify-around items-center`}>  
          <legend>Your tier:</legend>  
          {tiers.map((tier, index) => (  
            <div className={`text-emerald-950/30`} key={index}>  
              <input className={`inert:opacity-60`} inert id={tier!} readOnly type={'radio'}  
                     checked={tier === user.tier} />  
              <label className={`ms-2`} htmlFor={tier!}>{tier}</label>  
            </div>  
          ))}  
        </fieldset>  
        {error && <div className={`text-red-400`}>{error}</div>}  
        <SubmitButton loading={isLoading} text={`Update account`} />  
      </form>  
  </FormContainer>  
  
}