import React from 'react'
import CreateForm from './components/createForm'
import { getUser } from '../../(auth)/actions/getUser'
import { redirect } from 'next/navigation'

type SearchParams = { [key: string]: string | undefined }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<React.ReactElement> {
  const params = await searchParams
  const { redirect: redirectPath } = params
  const user = await getUser()

  // If there's a logged-in user, redirect them
  if (user) {
    if (redirectPath) {
      redirect(redirectPath as string)
    }
    redirect('/?message=already_logged_in')
  }

  return <CreateForm redirectPath={redirectPath as string | undefined} />
}
