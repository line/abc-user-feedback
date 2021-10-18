/* */
import React, { useRef, useState, useEffect } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

interface Props {
  position?: 'top' | 'right' | 'left' | 'bottom'
  overlay: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const DropDown = (props: Props) => {
  const { position = 'left', overlay, children, className } = props

  const dropDownRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleToggleDropDown = () => setOpen((s) => !s)

  const handleClickBound = (e: MouseEvent) => {
    if (dropDownRef?.current?.contains?.(e.target as Node)) {
      return
    }

    setOpen(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickBound)

    return () => {
      document.removeEventListener('mousedown', handleClickBound)
    }
  }, [])

  return (
    <div ref={dropDownRef} className={cx(styles.dropdown, className)}>
      <button
        type='button'
        className={styles.button}
        onClick={handleToggleDropDown}
      >
        {overlay}
      </button>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  )
}

export default DropDown
