/* */
import React, { useEffect, useState, useMemo } from 'react'
import { Modal, ROLE, SIZE } from 'baseui/modal'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'
import { VerifyContainer } from '~/containers'
import { useApp } from '~/hooks'
import { AppMode } from '@/types'

const VerifyPage = ({ email, query }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  const code = useMemo<string>(() => {
    if (query?.code) {
      return query.code as string
    }

    return ''
  }, [query])

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
            <VerifyContainer email={email} code={code} />
          </Modal>
        </div>
      )}
      {config?.app?.mode === AppMode.Page && (
        <div className={styles.inner}>
          <VerifyContainer email={email} code={code} />
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

export default VerifyPage
