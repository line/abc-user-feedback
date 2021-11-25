/* */
import React from 'react'
import Link from 'next/link'
import { Label1, Paragraph1 } from 'baseui/typography'

/* */
import styles from './styles.module.scss'

const OtherErrorPage = ({ statusCode, message, name }) => {
  return (
    <div className={styles.error}>
      <Label1>{statusCode} Error</Label1>
      <Paragraph1>{message}</Paragraph1>
      <Link href='/'>
        <a className={styles.link}>Go back to Home</a>
      </Link>
    </div>
  )
}

OtherErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = err ? err.statusCode : res ? res.statusCode : 500
  const name = err?.name
  const message = err?.message

  return { statusCode, name, message }
}

export default OtherErrorPage
