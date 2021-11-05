/* */
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

/* */
import { ActiveLink } from '~/components'
import { SideMenuContainer } from '~/containers'

const AccountSettingContainer = (props) => {
  const { t } = useTranslation()

  const menus = useMemo(
    () => [
      <ActiveLink href='/settings/profile'>{t('menu.account')}</ActiveLink>,
      <ActiveLink href='/settings/security'>
        {t('menu.password.change')}
      </ActiveLink>
    ],
    []
  )

  return (
    <SideMenuContainer
      menus={menus}
      {...props}
      heading={t('label.setting.user')}
    />
  )
}

export default AccountSettingContainer
