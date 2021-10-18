/* */
import React from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'
import { generateHexColorFromText } from '~/utils/color'

type AvatarSize = 'mini' | 'small' | 'medium'

interface Props {
  src: string
  type?: 'text' | 'image'
  size?: AvatarSize
  className?: string
  badge?: boolean
  onClick?: React.MouseEventHandler<HTMLImageElement>
}

const Avatar = (props: Props) => {
  const {
    className,
    src = '',
    type = 'image',
    onClick = () => {},
    size = 'medium',
    badge = false
  } = props

  return (
    <div
      className={cx(
        styles.avatar,
        styles[`avatar--${size}`],
        styles[`avatar__${type}`],
        className
      )}
    >
      {type === 'image' ? (
        <img
          className={styles.avatar__icon}
          src={src}
          onClick={onClick}
          alt=''
        />
      ) : (
        <span
          className={cx(styles.avatar__icon, styles.avatar__text)}
          style={{ backgroundColor: generateHexColorFromText(src) }}
        >
          {src.slice(0, 1).toUpperCase()}
        </span>
      )}
      {badge && (
        <div className={styles.badge}>
          <span className={styles.badge__dot} />
        </div>
      )}
    </div>
  )
}

export default Avatar
