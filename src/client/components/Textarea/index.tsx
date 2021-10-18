/* */
import React, { useState, forwardRef, useEffect } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

type Props = {
  disabled?: boolean
  className?: string
  placeholder?: string
  name?: string
  rows?: number
  maxRows?: number
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  inputClassName?: string
}

const TextArea = forwardRef((props: Props, ref: any) => {
  const {
    disabled = false,
    className,
    placeholder,
    name,
    rows = 5,
    maxRows = 20,
    inputClassName,
    onChange,
    value
  } = props

  const [row, setRow] = useState<number>(rows)

  useEffect(() => {
    const r = (value ?? '').split('\n')

    if (r?.length < maxRows) {
      setRow(r.length)
    }
  }, [value])

  return (
    <div className={cx(styles.wrapper, className)}>
      <textarea
        ref={ref}
        value={value}
        placeholder={placeholder}
        name={name}
        rows={row}
        onChange={onChange}
        className={cx(styles.textarea, inputClassName)}
        disabled={disabled}
      />
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea
