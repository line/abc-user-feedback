/* */
import React, { useState } from 'react'
import * as yup from 'yup'
import { useSnackbar } from 'baseui/snackbar'
import { Delete } from 'baseui/icon'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, KIND as ButtonKind } from 'baseui/button'
import { Paragraph3 } from 'baseui/typography'
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
import { useTranslation } from 'next-i18next'

/* */
import { sendFindPasswordEmail } from '~/service/mail'
import { ErrorMessage } from '~/components'

interface Props extends ModalProps {
  onClose: any
}

const FindPasswordModal = (props: Props) => {
  const { isOpen, onClose } = props
  const { enqueue } = useSnackbar()
  const [emailSended, setEmailSended] = useState<boolean>(false)

  const { t } = useTranslation()

  const schema = yup.object().shape({
    email: yup.string().email(t('validation.email')).required()
  })

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
      <ModalHeader>{t('title.password.reset')}</ModalHeader>
      <ModalBody>
        <Paragraph3 $style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
          {emailSended
            ? t('snackbar.success.send.mail.invitation')
            : t('description.password.reset')}
        </Paragraph3>
        {emailSended ? (
          <div style={{ marginTop: 10 }}>
            <Button kind={ButtonKind.primary} onClick={handleClose}>
              {t('action.send.mail.invitation')}
            </Button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 10 }}>
              <Input
                {...register('email')}
                placeholder={t('placeholder.email')}
              />
              <ErrorMessage errors={errors} name='email' />
            </div>
            <div style={{ marginTop: 16 }}>
              <ModalButton onClick={handleClose} kind={ButtonKind.tertiary}>
                {t('action.cancel')}
              </ModalButton>
              <ModalButton
                kind={ButtonKind.primary}
                onClick={handleSendFindpasswordEmail}
                disabled={!watchEmail}
              >
                {t('action.send.mail.invitation')}
              </ModalButton>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default FindPasswordModal
