import React from 'react'
import { getUser } from '../actions/getUser'
import type { Customer, TierProps } from '@/payload-types'
import { ResetPasswordButton } from '../components/ResetPasswordButton'
import { Customers } from '@/collections/Customers/config'
import UpdateForm from '../components/UpdateForm'

export default async function Page(): Promise<React.ReactElement> {
  const user = (await getUser()) as Customer

  // Get the "tier" options from the Customers collection
  const tierField = Customers.fields.find(
    (field) => field.type === 'radio' && field.name === 'tier'
  )
  const tiers = tierField && 'options' in tierField ? tierField.options : []

  return (
    <main className="w-full mx-auto sm:max-w-sm my-8">
      <div className="my-8">
        <h1 className="text-2xl font-semibold text-emerald-950">
          Hello, {user?.firstName ? user.firstName : user?.email}
        </h1>
      </div>

      <UpdateForm user={user} tiers={tiers as TierProps[]} />

      <div className="flex justify-start items-center gap-4 mt-6">
        <ResetPasswordButton email={user.email} />
      </div>
    </main>
  )
}
