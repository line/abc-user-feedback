/* */
import React from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'

interface Props {
  children?: React.ReactNode
  title?: React.ReactNode
  className?: string
  heading: string
  menus: Array<React.ReactNode>
}

const SideMenuContainer = (props: Props) => {
  const { children, title, className, menus = [], heading } = props

  return (
    <div className={cx(styles.container, className)}>
      <Header />
      <div className={styles.page}>
        {menus.length >= 2 && (
          <div className={styles.side}>
            <div className={styles.heading}>{heading}</div>
            {menus}
          </div>
        )}
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SideMenuContainer
