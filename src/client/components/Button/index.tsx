/* */
import React, { useMemo } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

type HtmlType = 'button' | 'submit'
type ButtonType = 'default' | 'text' | 'primary'
type ButtonSize = 'medium'

interface Props
  extends Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'> {
  htmlType?: HtmlType
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: (...args: any[]) => any
  children?: React.ReactNode
}

const Button = (props: Props) => {
  const {
    type = 'default',
    size = 'medium',
    htmlType = 'button',
    loading = false,
    disabled,
    className,
    onClick,
    children
  } = props

  const buttonClassName = useMemo(() => {
    return cx(
      className,
      styles.button,
      styles[`button--${size}`],
      styles[`button__${type}`],
      {
        [styles['button--disabled']]: disabled || loading
      }
    )
  }, [className, disabled, loading, size, type])

  return (
    <button
      className={buttonClassName}
      type={htmlType}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <>{children}</>
    </button>
  )
}

export default Button
