/* */
import React from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

type Props = {
  children?: React.ReactNode
  className?: string
  effect?: 'dark' | 'light' | 'plain'
  type?: 'success' | 'info' | 'warning' | 'danger' | 'primary'
  size?: 'mini' | 'small' | 'medium'
}

const Tag = (props: Props) => {
  const { effect = 'light', type = 'primary', children, className } = props

  return (
    <span
      className={cx(
        styles.tag,
        styles[`tag__${type}`],
        styles[`tag__${effect}`],
        className
      )}
    >
      <span className={styles.tag__inner}>{children}</span>
    </span>
  )
}

export default Tag
