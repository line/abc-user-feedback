/* */
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { LoginModal, DropDown, Avatar, Divider } from '~/components'
import { useApp, useUser } from '~/hooks'

const Header = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { user, requestLogout } = useUser()
  const { service } = useApp()

  const { t } = useTranslation()

  const handleClickLogin = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const renderAvatar = useMemo(() => {
    if (user) {
      return (
        <Avatar
          src={user?.profile?.avatarUrl}
          name={user?.profile?.nickname || user?.email}
        />
      )
    }
    return null
  }, [user])

  return (
    <div className={styles.header} id='u-header'>
      <div className={styles.inner}>
        <div className={styles.container}>
          <div className={styles.item}>
            <a className={styles.logo} href='/'>
              {service?.logoUrl && (
                <img
                  src={service.logoUrl}
                  className={styles.logo__icon}
                  alt='Logo'
                />
              )}
              <span className={styles.logo__text}>{service?.name}</span>
            </a>
            {!user ? (
              <a className={styles.auth} onClick={handleClickLogin}>
                Login
              </a>
            ) : (
              <DropDown overlay={renderAvatar} className={styles.dropdown}>
                {user.role >= 2 && (
                  <>
                    <Link href={user.role >= 3 ? '/admin' : '/admin/user'}>
                      <a className={styles.dropdown__list}>
                        {user.role >= 3
                          ? t('menu.administration')
                          : t('menu.member')}
                      </a>
                    </Link>
                    <Divider margin={0.5} />
                  </>
                )}
                <Link href='/settings/profile'>
                  <a className={styles.dropdown__list}>{t('menu.account')}</a>
                </Link>
                <div className={styles.dropdown__list} onClick={requestLogout}>
                  {t('menu.logout')}
                </div>
              </DropDown>
            )}
          </div>
        </div>
      </div>
      <LoginModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  )
}

export default Header
