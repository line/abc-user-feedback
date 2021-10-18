/* */
import React from 'react'
import Link from 'next/link'

/* */
import styles from './styles.module.scss'

const OtherErrorPage = ({ statusCode }) => {
  return (
    <div className={styles.error}>
      <div className={styles.error_title}>{statusCode} Error</div>
      <Link href='/'>
        <a className={styles.error__link}>Go back to Home</a>
      </Link>
    </div>
  )
}

OtherErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.status : err ? err.status : 404
  return { statusCode }
}

export default OtherErrorPage
