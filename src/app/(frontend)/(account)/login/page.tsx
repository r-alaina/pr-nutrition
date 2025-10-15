import React from 'react'
import LoginForm from './components/loginForm'
import { getUser } from '../../(auth)/actions/getUser'
import { redirect } from 'next/navigation'

type SearchParams = { [key: string]: string | undefined }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<React.ReactElement> {
  const { message } = await searchParams

  // Check if user is already logged in
  const user = await getUser()
  if (user) {
    redirect('/?message=already_logged_in')
  }

  return <LoginForm />
}
