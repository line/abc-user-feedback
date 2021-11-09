/* */
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import { ErrorContainer } from '~/containers'

const NotInvitedPage = () => {
  return (
    <ErrorContainer
      title='User not invited'
      description='this service is private, so invited user can access it'
      link='/'
      linkMessage='Go back to Home'
    />
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

export default NotInvitedPage
