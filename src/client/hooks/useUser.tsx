/* */
import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/router'

/* */
import { logout } from '~/service/user'
import { IUser } from '@/types'

const isProduction = process.env.NODE_ENV === 'production'
const redirectBase = isProduction ? '/api/v1' : 'http://localhost:3000/api/v1'

interface UserContent {
  isLoading?: boolean
  isError?: boolean
  error?: any
  user?: IUser
  requesSocialLogin?: any
  requestLogout?: any
  setUser?: any
}

interface Props {
  currentUser?: IUser
  children?: React.ReactNode
}

export const UserContext = createContext<UserContent>({})

export function UserProvider(props: Props) {
  const [user, setUser] = useState<IUser>(props?.currentUser)
  const router = useRouter()

  const requesSocialLogin = (provider: string, next = '/') => {
    window.location.href = `${redirectBase}/auth/redirect/${provider}?next=${next}`
    return false
  }

  const requestLogout = async () => {
    await logout()
    setUser(null)
    await router.reload()
  }

  const value = {
    user,
    setUser,
    requesSocialLogin,
    requestLogout
  }

  return <UserContext.Provider value={value} {...props} />
}

const useUser = () => useContext(UserContext)

export default useUser
