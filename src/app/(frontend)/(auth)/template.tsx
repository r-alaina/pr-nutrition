import { redirect } from 'next/navigation'  
import React, { ReactNode } from 'react'  
import {getUser} from './actions/getUser' 
import {LogoutButton} from '@/app/(frontend)/(auth)/components/LogoutButton'

  
const Template: React.FC<{ children: ReactNode }> = async ({children}) => {  
  const user = await getUser()  
  if (!user) {  
  // if there's no user, we can redirect the browser back to the login route
    redirect('/login')  
  }  
  // if there is, we can show the page content

// ...more code
return <>  
  <div className={`bg-emerald-500 p-4`}>  
    <LogoutButton />  
</div>  
  {children}  
</>
// ...more code
}  
  
export default Template