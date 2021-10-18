/* */
import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

interface Props {
  children?: React.ReactNode
  className?: string
  href?: string
}

const ActiveLink = (props: Props) => {
  const { children, href } = props
  const { asPath } = useRouter()

  return (
    <Link href={href}>
      <a
        className={cx(styles.link, {
          [styles[`link--active`]]: asPath === href
        })}
      >
        {children}
      </a>
    </Link>
  )
}

export default ActiveLink
