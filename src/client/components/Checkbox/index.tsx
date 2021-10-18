/* */
import React, { useMemo, useState, forwardRef, useEffect } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

type Props = {
  disabled?: boolean
  className?: string
  value?: any
  name?: string
  error?: boolean
  checked?: boolean
  children?: React.ReactNode
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any
}

const Checkbox = forwardRef((props: Props, ref: any) => {
  const {
    disabled = false,
    className = '',
    children,
    value,
    name = '',
    error = false,
    checked = false,
    onChange = () => {}
  } = props

  const [check, setCheck] = useState<boolean>(checked)
  const [focus, setFocus] = useState<boolean>(false)

  useEffect(() => {
    setCheck(checked)
  }, [checked])

  const checkboxClassName = useMemo(
    () =>
      cx(className, styles.checkbox, {
        [styles.disabled]: disabled,
        [styles.focus]: focus,
        [styles.error]: error,
        [styles.checked]: check
      }),
    [className, disabled, focus, error, check]
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked: _checked } = event.target
    setCheck(_checked)
    onChange?.(event)
  }

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = () => {
    setFocus(false)
  }

  return (
    <label className={checkboxClassName}>
      <span className={styles.checkInput}>
        <span className={styles.checkInner} />
        <input
          ref={ref}
          type='checkbox'
          name={name}
          value={value}
          checked={check}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={styles.checkOrigin}
        />
      </span>
      <span className={styles.label}>{children}</span>
    </label>
  )
})

Checkbox.displayName = 'CheckBox'

export default Checkbox
