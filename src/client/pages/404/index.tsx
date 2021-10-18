/* */
import React from 'react'

/* */
import { ErrorContainer } from '~/containers'

const NotFound = () => {
  return (
    <ErrorContainer
      title='Sorry, this page is not available'
      description='The link you clicked may be broken, or the page may have been removed.'
      link='/'
      linkMessage='Go back to Home'
    />
  )
}

export default NotFound
