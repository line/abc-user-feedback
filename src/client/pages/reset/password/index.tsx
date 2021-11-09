/* */
import React, { useEffect, useState } from 'react'
import { Modal, SIZE, ROLE } from 'baseui/modal'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'
import { ResetContainer } from '~/containers'
import { useApp } from '~/hooks'
import { AppMode } from '@/types'

const ResetPasswordPage = ({ code }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { config } = useApp()

  useEffect(() => {
    setShowModal(true)
  }, [])

  return (
    <div className={styles.container}>
      {config?.app?.mode === AppMode.Modal && (
        <div>
          <Header />
          <Modal
            isOpen={showModal}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
          >
            <ResetContainer code={code} />
          </Modal>
        </div>
      )}
      {config?.app?.mode === AppMode.Page && (
        <div className={styles.inner}>
          <ResetContainer code={code} />
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const locale = query?.service?.locale || 'en'

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default ResetPasswordPage
