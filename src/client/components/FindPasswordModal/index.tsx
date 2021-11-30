/* */
import React from 'react'
import * as yup from 'yup'
import { useSnackbar } from 'baseui/snackbar'
import { Check } from 'baseui/icon'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { KIND as ButtonKind } from 'baseui/button'
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

  const { t } = useTranslation()

  const schema = yup.object().shape({
    email: yup.string().email(t('validation.email.domian')).required()
  })

  const {
    watch,
    control,
    formState,
    handleSubmit,
    reset,
    clearErrors,
    setError
  } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  const watchEmail = watch('email')

  const handleClose = () => {
    reset()
    clearErrors()
    onClose?.()
  }

  const handleSendFindPasswordEmail = async (payload) => {
    try {
      await sendFindPasswordEmail({
        email: payload.email
      })

      enqueue({
        message: t('snackbar.success.send.mail.reset.password'),
        startEnhancer: ({ size }) => <Check size={size} />
      })

      handleClose?.()
    } catch {
      setError('email', {
        type: 'manual',
        message: t('validation.email')
      })
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
      <form onSubmit={handleSubmit(handleSendFindPasswordEmail)}>
        <ModalHeader>{t('title.password.reset')}</ModalHeader>
        <ModalBody>
          <Paragraph3 $style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
            {t('description.password.reset')}
          </Paragraph3>
          <div style={{ marginTop: 10 }}>
            <Controller
              control={control}
              name='email'
              render={({ field }) => (
                <Input {...field} placeholder={t('placeholder.email')} />
              )}
            />
            <ErrorMessage errors={errors} name='email' />
          </div>
          <div style={{ marginTop: 16 }}>
            <ModalButton onClick={handleClose} kind={ButtonKind.tertiary}>
              {t('action.cancel')}
            </ModalButton>
            <ModalButton
              kind={ButtonKind.primary}
              type='submit'
              disabled={!watchEmail}
            >
              {t('action.send.mail.invitation')}
            </ModalButton>
          </div>
        </ModalBody>
      </form>
    </Modal>
  )
}

export default FindPasswordModal
