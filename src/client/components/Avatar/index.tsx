/* */
import React, { useMemo } from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'
import { generateHexColorFromText } from '~/utils/color'

type AvatarSize = 'mini' | 'small' | 'medium'

interface Props {
  src: string
  name?: string
  size?: AvatarSize
  className?: string
  badge?: boolean
  onClick?: React.MouseEventHandler<HTMLImageElement>
}

const Avatar = (props: Props) => {
  const {
    className,
    src = '',
    name = '',
    onClick = () => {},
    size = 'medium',
    badge = false
  } = props

  const avatarType = useMemo(() => {
    if (src) {
      return 'image'
    }

    return 'text'
  }, [src, name])

  return (
    <div
      className={cx(
        styles.avatar,
        styles[`avatar--${size}`],
        styles[`avatar__${avatarType}`],
        className
      )}
    >
      {avatarType === 'image' ? (
        <img
          className={styles.avatar__icon}
          src={src}
          onClick={onClick}
          alt=''
        />
      ) : (
        <span
          className={cx(styles.avatar__icon, styles.avatar__text)}
          style={{ backgroundColor: generateHexColorFromText(name) }}
        >
          {name.slice(0, 1).toUpperCase()}
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
