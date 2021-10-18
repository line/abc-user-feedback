/* */
import React, { useMemo } from 'react'
import {
  Modal,
  ROLE,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalButton,
  ModalProps,
  SIZE
} from 'baseui/modal'

interface Props extends ModalProps {
  feedback?: any
  onClose?: any
}

const ResponseSnippetModal = (props: Props) => {
  const { onClose, feedback, isOpen } = props

  const handleCloseModal = () => {
    onClose?.()
  }

  const renderUrl = useMemo(() => {
    if (feedback) {
      const [protocol, _, domain] = window?.location?.href?.split?.('/')

      return `${protocol}//${domain}/api/v1/feedback/${feedback?.code}/response`
    }
  }, [feedback])

  const renderValue = useMemo(() => {
    const response = {}

    if (feedback?.fields) {
      feedback.fields.map((field) => {
        const { isRequired, name } = field

        response[name] = ''

        if (isRequired) {
          response[name] = `*`
        }
      })

      return JSON.stringify(response, null, 2)
    }
  }, [feedback])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size={SIZE.auto}
      role={ROLE.dialog}
    >
      <ModalHeader>POST {renderUrl}</ModalHeader>
      <ModalBody>
        <pre>{renderValue}</pre>
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={handleCloseModal}>Close</ModalButton>
      </ModalFooter>
    </Modal>
  )
}

export default ResponseSnippetModal
