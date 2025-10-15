import React from 'react'
import CreateForm from './components/createForm'
import { getUser } from '../../(auth)/actions/getUser'
import { redirect } from 'next/navigation'

export default async function Page(): Promise<React.ReactElement> {
  const user = await getUser()

  // If there's a logged-in user, redirect them to the home page
  if (user) {
    redirect('/?message=already_logged_in')
  }

  return <CreateForm />
}
