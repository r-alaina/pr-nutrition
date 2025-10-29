import React from 'react'
import AdminSignupForm from './components/AdminSignupForm'
import { getUser } from '../../(auth)/actions/getUser'
import { redirect } from 'next/navigation'

export default async function AdminSignupPage(): Promise<React.ReactElement> {
  // Note: We don't check if user is logged in here, as they might want to create
  // an admin account even if they're logged in as a customer

  return <AdminSignupForm />
}
