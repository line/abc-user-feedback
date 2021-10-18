/* */
import React, { useMemo } from 'react'

/* */
import { ActiveLink } from '~/components'
import { SideMenuContainer } from '~/containers'
import { useUser } from '~/hooks'

const AdminPageContainer = (props) => {
  const { user } = useUser()

  const menus = useMemo(() => {
    const menu = []
    if (user) {
      if (user.role >= 2) {
        menu.push([
          <ActiveLink href='/admin'>Service</ActiveLink>,
          <ActiveLink href='/admin/invitation'>Invitation</ActiveLink>
        ])
      }

      if (user.role >= 1) {
        menu.push([
          <ActiveLink href='/admin/feedback'>Feedback</ActiveLink>,
          <ActiveLink href='/admin/user'>User</ActiveLink>
        ])
      }
    }

    return menu
  }, [user])

  return <SideMenuContainer menus={menus} {...props} heading='Admin Setting' />
}

export default AdminPageContainer
