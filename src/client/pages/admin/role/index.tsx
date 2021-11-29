/* */
import React, { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { AdminPageContainer, RoleListContainer } from '~/containers'
import { Button, InviteUserModal } from '~/components'
import { useApp } from '~/hooks'

const AdminRolePage = () => {
  const { config } = useApp()

  const { t } = useTranslation()

  return (
    <AdminPageContainer title='Role'>
      <RoleListContainer />
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

export default AdminRolePage
