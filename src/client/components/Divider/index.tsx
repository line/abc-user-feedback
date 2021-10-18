/* */
import React, { useMemo } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

const classPrefix = 'divider'

interface DividerProps {
  className?: string
  margin?: number
  direction?: 'horizontal' | 'vertical'
  children?: React.ReactNode
}

const Divider = (props: DividerProps) => {
  const {
    className,
    direction = 'horizontal',
    children,
    margin,
    ...restProps
  } = props

  const classString = cx(
    styles[classPrefix],
    styles[`${classPrefix}--${direction}`],
    {
      [styles[`${classPrefix}--has-children`]]: !!children
    },
    className
  )

  const styleSheet = useMemo(() => {
    if (direction === 'horizontal') {
      return {
        margin: `${margin || 24}px 0`
      }
    } else {
      return {
        margin: `0 ${margin || 8}px`
      }
    }
  }, [direction, margin])

  return (
    <div
      {...restProps}
      className={classString}
      role='separator'
      style={styleSheet}
    >
      {children && <span className={`${classPrefix}__inner`}>{children}</span>}
    </div>
  )
}

export default Divider
