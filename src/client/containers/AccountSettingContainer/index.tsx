/* */
import React, { useMemo } from 'react'

/* */
import { ActiveLink } from '~/components'
import { SideMenuContainer } from '~/containers'

const AccountSettingContainer = (props) => {
  const menus = useMemo(
    () => [
      <ActiveLink href='/settings/profile'>Profile</ActiveLink>,
      <ActiveLink href='/settings/account'>Account</ActiveLink>,
      <ActiveLink href='/settings/security'>Security</ActiveLink>
    ],
    []
  )

  return <SideMenuContainer menus={menus} {...props} heading='User Setting' />
}

export default AccountSettingContainer
