/* */
import React, { forwardRef, InputHTMLAttributes } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  prepand?: React.ReactElement
}

const Input = forwardRef((props: Props, ref: any) => {
  const { className, prepand } = props

  return (
    <div className={cx(styles.wrapper, className)}>
      {prepand && <div className={styles.prepand}>{prepand}</div>}
      <input
        {...props}
        className={cx(styles.input, {
          [styles['input--has-prepand']]: !!prepand
        })}
        ref={ref}
      />
    </div>
  )
})

Input.displayName = 'Input'

export default Input
