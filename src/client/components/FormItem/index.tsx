/* */
import React from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

interface Props {
  label?: string
  style?: React.CSSProperties
  description?: React.ReactNode
  required?: boolean
  className?: string
  children?: React.ReactNode
}

const FormItem = (props: Props) => {
  const {
    label,
    description,
    required = false,
    children,
    className,
    style
  } = props

  return (
    <div className={cx(styles.item, className)} style={style}>
      <span
        className={cx(styles.item__label, {
          [styles['item__label--required']]: required
        })}
      >
        {label}
      </span>
      {children}
      {description && (
        <div className={styles.item__description}>{description}</div>
      )}
    </div>
  )
}

export default FormItem
