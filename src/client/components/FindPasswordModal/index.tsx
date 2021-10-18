/* */
import React, { useState } from 'react'
import * as yup from 'yup'
import { useSnackbar } from 'baseui/snackbar'
import { Delete } from 'baseui/icon'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, KIND as ButtonKind } from 'baseui/button'
import {
  Modal,
  ROLE,
  SIZE as ModalSize,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalButton
} from 'baseui/modal'
import { Input } from 'baseui/input'

/* */
import { sendFindPasswordEmail } from '~/service/mail'
import { ErrorMessage } from '~/components'

interface Props extends ModalProps {
  onClose: any
}

const schema = yup.object().shape({
  email: yup.string().email('not a email format').required()
})

const FindPasswordModal = (props: Props) => {
  const { isOpen, onClose } = props
  const { enqueue } = useSnackbar()
  const [emailSended, setEmailSended] = useState<boolean>(false)

  const { register, watch, trigger, formState, getValues, reset, clearErrors } =
    useForm({
      resolver: yupResolver(schema)
    })

  const { errors } = formState

  const watchEmail = watch('email')

  const handleClose = () => {
    reset()
    clearErrors()
    setEmailSended(false)
    onClose?.()
  }

  const handleSendFindpasswordEmail = async () => {
    const isValid = await trigger()

    if (isValid) {
      const payload = getValues()

      try {
        await sendFindPasswordEmail({
          email: payload.email
        })
        setEmailSended(true)
      } catch (error) {
        if (error?.response?.data?.message) {
          enqueue({
            message: error.response.data.message,
            startEnhancer: ({ size }) => <Delete size={size} />
          })
        } else {
          enqueue({
            message: error.toString(),
            startEnhancer: ({ size }) => <Delete size={size} />
          })
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable={false}
      size={ModalSize.auto}
      role={ROLE.dialog}
    >
      <ModalHeader> Forgot your password?</ModalHeader>
      <ModalBody>
        <div>
          {emailSended
            ? `Check your email`
            : `Enter your email address and we'll send you a link to reset your
          password`}
        </div>
        {emailSended ? (
          <div style={{ marginTop: 10 }}>
            <Button kind={ButtonKind.primary} onClick={handleClose}>
              Confirm
            </Button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 10 }}>
              <Input {...register('email')} placeholder='your@email.com' />
              <ErrorMessage errors={errors} name='email' />
            </div>
            <div style={{ marginTop: 16 }}>
              <ModalButton onClick={handleClose} kind={ButtonKind.tertiary}>
                Cancel
              </ModalButton>
              <ModalButton
                kind={ButtonKind.primary}
                onClick={handleSendFindpasswordEmail}
                disabled={!watchEmail}
              >
                Send
              </ModalButton>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default FindPasswordModal
