/* */
import React, { useMemo } from 'react'

/* */
import { ActiveLink } from '~/components'
import { SideMenuContainer } from '~/containers'
import { useUser } from '~/hooks'

const AdminPageContainer = (props: any) => {
  const { user } = useUser()

  const menus = useMemo(() => {
    const menu = []
    if (user) {
      if (user.role >= 3) {
        menu.push(
          <ActiveLink href='/admin' key='/admin'>
            Service
          </ActiveLink>,
          <ActiveLink href='/admin/invitation' key='/admin/invitation'>
            Invitation
          </ActiveLink>,
          <ActiveLink href='/admin/feedback' key='/admin/feedback'>
            Feedback
          </ActiveLink>
        )
      }

      if (user.role >= 2) {
        menu.push(
          <ActiveLink href='/admin/user' key='/admin/user'>
            User
          </ActiveLink>
        )
      }
    }

    return menu
  }, [user])

  return <SideMenuContainer menus={menus} {...props} heading='Admin Setting' />
}

export default AdminPageContainer
