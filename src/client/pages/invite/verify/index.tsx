/* */
import React, { useEffect, useState } from 'react'
import { Modal, ROLE, SIZE } from 'baseui/modal'

/* */
import styles from './styles.module.scss'
import { Header } from '~/components'
import { VerifyContainer } from '~/containers'
import { useApp } from '~/hooks'
import { AppMode } from '@/types'

const VerifyPage = ({ email, code }) => {
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

export default VerifyPage
