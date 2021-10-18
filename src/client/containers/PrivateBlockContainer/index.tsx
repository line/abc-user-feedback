/* */
import React from 'react'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'
import { useApp } from '~/hooks'

const PrivateBlockContainer = () => {
  const { service } = useApp()

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.block}>
        <div className={styles.block__title}>
          Sorry, {service.name} is private service
        </div>
        <div className={styles.block__description}>
          you can sign in if you have account or registered email
        </div>
      </div>
    </div>
  )
}

export default PrivateBlockContainer
