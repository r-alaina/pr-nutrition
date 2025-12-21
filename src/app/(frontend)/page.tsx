// src/app/(frontend)/page.tsx
import { getUser } from '@/app/(frontend)/(auth)/actions/getUser'
import AuthenticatedHome from './components/AuthenticatedHome'
import UnauthenticatedHome from './components/UnauthenticatedHome'
import ChallengeBanner from './components/challenges/ChallengeBanner'

export default async function HomePage() {
  const user = await getUser()
  const banner = <ChallengeBanner />

  // If user is logged in, show authenticated home
  if (user) {
    return <AuthenticatedHome user={user} challengeBanner={banner} />
  }

  // If user is not logged in, show unauthenticated home
  return <UnauthenticatedHome challengeBanner={banner} />
}
