/* */
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'

/* */
import styles from './styles.module.scss'
import { Post } from '~/components'
import { getPosts } from '~/service/post'
import PostLoader from '~/components/Loader/Post'

const PostListContainer = () => {
  // const { isLoading, isError, error, data } = useQuery('posts', getPosts)
  const data = []

  const renderPostList = useMemo(() => {
    if (data?.length) {
      return (
        <>
          {data.map((post: any, idx: number) => (
            <Post key={idx} post={post} />
          ))}
        </>
      )
    }

    return (
      <div className={styles.emtpy}>
        {/*Empty here. start post your feedback!*/}
        Forum feature not support yet.
      </div>
    )
  }, [data])

  // if (isLoading) {
  //   return (
  //     <div className={styles.container}>
  //       <PostLoader rows={10} />
  //     </div>
  //   )
  // }

  // if (isError) {
  //   return <span>Error: {error}</span>
  // }

  return <div className={styles.container}>{renderPostList}</div>
}

export default PostListContainer
