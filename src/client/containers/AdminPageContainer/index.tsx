/* */
import React from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'
import { Header, ActiveLink } from '~/components'
import { useUser } from '~/hooks'

interface Props {
  children?: React.ReactNode
  title?: React.ReactNode
  className?: string
}

const AdminPageContainer = (props: Props) => {
  const { children, title, className } = props

  const { user } = useUser()

  return (
    <div className={cx(styles.container, className)}>
      <Header />
      <div className={styles.page}>
        <div className={styles.page__side}>
          {user?.role >= 2 && <ActiveLink href='/admin'>Service</ActiveLink>}
          {user?.role >= 2 && (
            <ActiveLink href='/admin/invitation'>Invitation</ActiveLink>
          )}
          {user?.role >= 1 && (
            <ActiveLink href='/admin/feedback'>Feedback</ActiveLink>
          )}
          {user?.role >= 1 && <ActiveLink href='/admin/user'>User</ActiveLink>}
        </div>
        <div className={styles.page__content}>
          <h1 className={styles.page__title}>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminPageContainer
