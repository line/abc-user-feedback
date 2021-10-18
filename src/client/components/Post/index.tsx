/* */
import React from 'react'
import cx from 'classnames'

/* */
import styles from './styles.module.scss'

interface Props {
  post: any
}

const Post = (props: Props) => {
  const { post } = props

  const handleClickVote = () => {}

  return (
    <div className={styles.post}>
      <div className={styles.left}>
        <button
          className={cx(styles.vote, { [styles['vote--active']]: !post.id })}
          onClick={handleClickVote}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M7.13375 5.5C7.51865 4.83333 8.4809 4.83333 8.8658 5.5L12.3299 11.5C12.7148 12.1667 12.2337 13 11.4639 13H4.53567C3.76587 13 3.28475 12.1667 3.66965 11.5L7.13375 5.5Z'
              fill='black'
            />
          </svg>
          <span>3</span>
        </button>
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <a className={styles.title} href={`/post/${post.id}`}>
            {post.title}
          </a>
        </div>
        <p className={styles.content}>{post.body}</p>
      </div>
    </div>
  )
}

export default Post
