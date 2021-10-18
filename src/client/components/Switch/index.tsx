/* */
import React, { useState, forwardRef, useEffect } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

interface Props {
  disabled?: boolean
  onChange?: (...args: any) => any
  value?: boolean
}

const Switch = forwardRef((props: Props, ref) => {
  const { disabled = false, onChange = () => {}, value } = props
  const [active, setActive] = useState<boolean>()

  useEffect(() => {
    setActive(value)
  }, [value])

  const handleToggleSwitch = () => {
    if (!disabled) {
      setActive((_active) => !_active)
      onChange(!value)
    }
  }

  return (
    <div
      className={cx(styles.switch, {
        [styles['switch--active']]: active,
        [styles['switch--disabled']]: disabled
      })}
      onClick={handleToggleSwitch}
    >
      <div className={styles.switch__controller} />
    </div>
  )
})

export default Switch
