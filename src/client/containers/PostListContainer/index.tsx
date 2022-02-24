/* */
import React, { useMemo } from 'react'

/* */
import styles from './styles.module.scss'
import { Post } from '~/components'

const PostListContainer = () => {
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
