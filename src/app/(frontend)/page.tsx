// src/app/(frontend)/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import AuthenticatedHome from './components/AuthenticatedHome'
import UnauthenticatedHome from './components/UnauthenticatedHome'

export default async function HomePage() {
  const user = await getUser()

  // If user is logged in, show authenticated home
  if (user) {
    return <AuthenticatedHome user={user} />
  }

  // If user is not logged in, show unauthenticated home
  return <UnauthenticatedHome />
}
