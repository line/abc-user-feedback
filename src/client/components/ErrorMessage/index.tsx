/* */
import React from 'react'
import cx from 'classnames'
import { ErrorMessage } from '@hookform/error-message'

/* */
import styles from './styles.module.scss'

const CustomErrorMessage = (props) => {
  const { className, ...restProps } = props
  return (
    <ErrorMessage
      {...restProps}
      render={({ message }) => (
        <span className={cx(styles.error, className)}>{message}</span>
      )}
    />
  )
}

export default CustomErrorMessage
