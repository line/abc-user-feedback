/* */
import React from 'react'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'
import PostListContainer from '~/containers/PostListContainer'

const MainPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <PostListContainer />
    </div>
  )
}

export async function getServerSideProps(ctx) {
  return {
    props: {}
  }
}

export default MainPage
