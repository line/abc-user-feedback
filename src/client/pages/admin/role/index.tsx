/* */
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import { AdminPageContainer, RoleListContainer } from '~/containers'

const AdminRolePage = () => {
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
