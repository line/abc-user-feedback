/* */
import React from 'react'

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

export default NotInvitedPage
