import { authClient } from '@/lib/auth-client'
import React from 'react'

const VerifyEmail = () => {


  return (<>
    <div>Verify Email page</div>
    <h2>Please enter the OTP</h2>
    <input type="text" placeholder='OTP'/>
    </>
  )
}

export default VerifyEmail