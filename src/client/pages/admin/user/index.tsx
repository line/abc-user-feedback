/* */
import React, { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { AdminPageContainer, UserListContainer } from '~/containers'
import { Button, InviteUserModal } from '~/components'
import { useApp } from '~/hooks'

const AdminUserPage = () => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false)

  const { config } = useApp()

  const { t } = useTranslation()

  const handleShowInviteUserModal = () => {
    setShowInviteModal(true)
  }

  const handleCloseInviteModal = () => {
    setShowInviteModal(false)
  }

  return (
    <AdminPageContainer title={t('title.member')}>
      <div className={styles.invite}>
        <div className={styles.invite__title}>
          <Button
            onClick={handleShowInviteUserModal}
            disabled={!config.email.enable}
          >
            {t('action.member.invite')}
            {!config.email.enable && ' (check smtp setting)'}
          </Button>
        </div>
      </div>
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
