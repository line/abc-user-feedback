/* */
import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/router'

/* */
import { logout } from '~/service/user'
import { IUser, Permission } from '@/types'

const isProduction = process.env.NODE_ENV === 'production'
const redirectBase = isProduction ? '/api/v1' : 'http://localhost:3000/api/v1'

interface User extends IUser {
  permissions: Array<Permission>
}

interface UserContent {
  isLoading?: boolean
  isError?: boolean
  error?: any
  user?: User
  requestSocialLogin?: any
  hasPermission?: (permission: Permission) => boolean
  requestLogout?: any
  setUser?: any
}

interface Props {
  currentUser?: User
  children?: React.ReactNode
}

export const UserContext = createContext<UserContent>({})

export function UserProvider(props: Props) {
  const [user, setUser] = useState<User>(props?.currentUser)
  const router = useRouter()

  const requestSocialLogin = (provider: string, next = '/') => {
    window.location.href = `${redirectBase}/auth/redirect/${provider}?next=${next}`
    return false
  }

  const hasPermission = (permission: Permission) => {
    return (
      user?.permissions?.includes?.(Permission.MANAGE_ALL) ||
      user?.permissions?.includes?.(permission)
    )
  }

  const requestLogout = async () => {
    await logout()
    setUser(null)
    await router.reload()
  }

  const value = {
    user,
    setUser,
    hasPermission,
    requestSocialLogin,
    requestLogout
  }

  return <UserContext.Provider value={value} {...props} />
}

const useUser = () => useContext(UserContext)

export default useUser
