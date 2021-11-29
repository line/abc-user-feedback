/* */
import React, { useMemo } from 'react'

/* */
import { ActiveLink } from '~/components'
import { SideMenuContainer } from '~/containers'
import { useUser } from '~/hooks'
import { Permission } from '@/types'

const AdminPageContainer = (props: any) => {
  const { user, hasPermission } = useUser()

  const menus = useMemo(() => {
    const menu = []
    if (user) {
      if (hasPermission(Permission.MANAGE_TENANT)) {
        menu.push(
          <ActiveLink href='/admin' key='/admin'>
            Service
          </ActiveLink>
        )
      }

      if (hasPermission(Permission.READ_ROLES)) {
        menu.push(
          <ActiveLink href='/admin/role' key='/admin/role'>
            Roles
          </ActiveLink>
        )
      }

      if (hasPermission(Permission.MANAGE_INVITATION)) {
        menu.push(
          <ActiveLink href='/admin/invitation' key='/admin/invitation'>
            Invitation
          </ActiveLink>
        )
      }

      if (hasPermission(Permission.READ_FEEDBACKS)) {
        menu.push(
          <ActiveLink href='/admin/feedback' key='/admin/feedback'>
            Feedback
          </ActiveLink>
        )
      }

      if (hasPermission(Permission.READ_USERS)) {
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
