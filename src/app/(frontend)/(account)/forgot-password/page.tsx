import React from 'react'  
import ForgotForm from './components/ForgotPasswordForm'  
  
export const Page = () => {  
  return <div className={`h-[100vh] w-full mx-auto sm:max-w-sm`}>  
    <div className={`flex justify-center mt-8`}>  
    {/* simply return the form component */}
      <ForgotForm />  
    </div>  
  </div>  
}  
  
  
export default Page