/* */
import React from 'react'
import { useQuery } from 'react-query'

/* */
import styles from '~/components/Post/styles.module.scss'
import Post from '~/components/Post'
import PostLoader from '~/components/Loader/Post'
import { getPostById } from '~/service/post'

interface Props {
  postId: string
}

const PostContainer = (props: Props) => {
  const { postId } = props
  const { isLoading, isError, error, data } = useQuery(['post', postId], () =>
    getPostById(postId)
  )

  if (isLoading) {
    return <PostLoader />
  }

  if (isError) {
    return <span>Error: {error}</span>
  }

  return (
    <div className={styles.post}>
      <Post post={data} />
    </div>
  )
}

export default PostContainer
