/* */
import React, { useState } from 'react'

/* */
import styles from './styles.module.scss'
import { Button, LoginModal, Header } from '~/components'

const RequireLoginPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleClickLogin = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.page__inner}>
        <h1>You are not authorized to view this page</h1>
        <h3>Need to login first</h3>
        <Button onClick={handleClickLogin}>Login</Button>
      </div>
      <LoginModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  )
}

export default RequireLoginPage
