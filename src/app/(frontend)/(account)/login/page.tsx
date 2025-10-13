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
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner stays at top */}
      {message && (
        <div className="flex justify-center mt-6 px-4">
          <p className="w-auto inline-block mx-auto p-4 bg-emerald-100 text-emerald-950 border border-emerald-950 rounded-md">
            {message}
          </p>
        </div>
      )}

      {/*Center the login form vertically */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full sm:max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
