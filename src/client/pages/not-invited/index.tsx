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
  return {
    props: {
      ...(await serverSideTranslations(query.service.locale, ['common']))
    }
  }
}

export default NotInvitedPage
