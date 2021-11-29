/* */
import React, { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { AdminPageContainer, UserListContainer } from '~/containers'
import { Button, InviteUserModal } from '~/components'
import { useApp, useUser } from '~/hooks'
import { Permission } from '@/types'

const AdminUserPage = () => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false)

  const { config } = useApp()
  const { hasPermission } = useUser()

  const { t } = useTranslation()

  const handleShowInviteUserModal = () => {
    setShowInviteModal(true)
  }

  const handleCloseInviteModal = () => {
    setShowInviteModal(false)
  }

  return (
    <AdminPageContainer title={t('title.member')}>
      {hasPermission(Permission.INVITE_USER) && (
        <div className={styles.invite}>
          <Button
            onClick={handleShowInviteUserModal}
            disabled={!config.email.enable}
          >
            {t('action.member.invite')}
            {!config.email.enable && ' (check smtp setting)'}
          </Button>
        </div>
      )}
      <UserListContainer />
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={handleCloseInviteModal}
      />
    </AdminPageContainer>
  )
}

export const getServerSideProps = async ({ query }) => {
  const locale = query?.service?.locale || 'en'

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default AdminUserPage
