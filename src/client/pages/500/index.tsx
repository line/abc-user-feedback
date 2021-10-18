/* */
import React from 'react'
import Link from 'next/link'

/* */
import { ErrorContainer } from '~/containers'

const ServerSideError = () => {
  return (
    <ErrorContainer
      title='Sorry, something is wrong'
      link='/'
      linkMessage='Go back to Home'
    />
  )
}

export default ServerSideError
