/* */
import React from 'react'
import Link from 'next/link'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'

const IternalErrorContainer = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.block}>
        <div className={styles.block__title}>An error has occurred</div>
        <Link href='/'>
          <a className={styles.block__home}>Go to home</a>
        </Link>
      </div>
    </div>
  )
}

export default IternalErrorContainer
