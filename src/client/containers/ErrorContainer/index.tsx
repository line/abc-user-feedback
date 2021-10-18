/* */
import React from 'react'
import Link from 'next/link'

/* */
import styles from './styles.module.scss'
import { useApp } from '~/hooks'

interface Props {
  withLogo?: boolean
  title: React.ReactNode
  description?: React.ReactNode
  link?: string
  linkMessage?: string
  children?: React.ReactNode
}

const ErrorContainer = (props: Props) => {
  const {
    withLogo = true,
    title,
    description,
    link,
    linkMessage = 'Link',
    children
  } = props
  const { service } = useApp()

  return (
    <div className={styles.error}>
      {withLogo && service?.logoUrl && (
        <img src={service.logoUrl} className={styles.error__logo} alt='logo' />
      )}
      <div className={styles.error__title}>{title}</div>
      {description && (
        <div className={styles.error__description}>{description}</div>
      )}
      {children}
      {link && (
        <Link href='/'>
          <a className={styles.nerror__link}>{linkMessage}</a>
        </Link>
      )}
    </div>
  )
}

export default ErrorContainer
