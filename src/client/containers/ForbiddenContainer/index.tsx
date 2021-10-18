/* */
import React from 'react'

/* */
import styles from './styles.module.scss'
import { AdminPageContainer } from '~/containers'

const ForbiddenContainer = () => {
  return (
    <AdminPageContainer title='Setting Service'>
      <div className={styles.block}>
        <div className={styles.block__title}>You do not have permission</div>
      </div>
    </AdminPageContainer>
  )
}

export default ForbiddenContainer
