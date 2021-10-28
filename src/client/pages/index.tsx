/* */
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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

export const getServerSideProps = async ({ query }) => {
  return {
    props: {
      ...(await serverSideTranslations(query.service.locale, ['common']))
    }
  }
}

export default MainPage
