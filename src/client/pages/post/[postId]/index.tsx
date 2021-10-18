/* */
import React from 'react'
import { useRouter } from 'next/router'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'
import PostContainer from '~/containers/PostContainer'

const PostDetail = () => {
  const router = useRouter()
  const postId = router.query.postId as string

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.postDetail}>
        <PostContainer postId={postId} />
      </div>
    </div>
  )
}

export default PostDetail
