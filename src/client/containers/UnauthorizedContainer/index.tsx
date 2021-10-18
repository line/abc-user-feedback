/* */
import React from 'react'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'

const UnauthorizedContainer = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.block}>
        <div className={styles.block__title}>No authorization found.</div>
        <div className={styles.block__description}>you need to login first</div>
      </div>
    </div>
  )
}

export default UnauthorizedContainer
