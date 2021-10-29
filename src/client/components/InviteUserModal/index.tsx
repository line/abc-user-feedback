/* */
import React, { useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  ModalProps,
  SIZE,
  ROLE
} from 'baseui/modal'
import { useTranslation } from 'next-i18next'
import { KIND as ButtonKind } from 'baseui/button'

/* */
import styles from './styles.module.scss'
import { sendInvitationEmail } from '~/service/mail'
import { Textarea, FormItem, ErrorMessage } from '~/components'
import { useApp, useUser } from '~/hooks'

interface Props extends ModalProps {
  onClose?: any
}

const InviteUserModal = (props: Props) => {
  const { onClose, isOpen } = props

  const { t } = useTranslation()

  const schema = yup.object().shape({
    emails: yup
      .string()
      .test('email format', t('validation.email'), (emails = '') => {
        const emailSchema = yup.string().email()
        const parsed = emails
          .split(/\n/)
          .filter((email) => email)
          .map((email) => email.trim())

        return parsed.every((email) => emailSchema.isValidSync(email))
      })
      .required(),
    role: yup.mixed().required()
  })

  const { user } = useUser()
  const { service } = useApp()
  const { enqueue } = useSnackbar()

  const { handleSubmit, control, reset, formState, setError, clearErrors } =
    useForm({
      resolver: yupResolver(schema)
    })

  const roleOptions = useMemo(
    () => [
      { value: 0, label: 'User', isDisabled: user.role < 1 },
      { value: 1, label: 'Admin', isDisabled: user.role < 1 },
      { value: 2, label: 'Manager', isDisabled: user.role < 2 },
      { value: 3, label: 'Owner', isDisabled: user.role < 3 }
    ],
    []
  )

  const { errors } = formState

  const handleCloseModal = () => {
    reset()
    clearErrors()
    onClose?.()
  }

  const handleSendInvitationEmail = async (payload) => {
    const { emails: _emails, role } = payload
    try {
      const emails = _emails.split(/\n/)

      let flag = true

      if (service.isRestrictDomain) {
        for (let i = 0; i < emails.length; i++) {
          const mailDomain = emails[i].split('@')[1]
          if (!service.allowDomains.includes(mailDomain)) {
            flag = false

            setError('emails', {
              type: 'manual',
              message: `${mailDomain} is not allowed domain`
            })

            break
          }
        }
      }

      if (flag) {
        await Promise.all(
          emails.map((email) =>
            sendInvitationEmail({ email: email.trim(), role: role.value })
          )
        )
        enqueue({
          message: `invitation has been sent`,
          startEnhancer: ({ size }) => <Check size={size} />
        })
      }
    } catch (err) {
      enqueue({
        message: 'error when send invitation',
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={SIZE.default}
      role={ROLE.dialog}
    >
      <ModalHeader>{t('title.member.invite')}</ModalHeader>
      <form
        className={styles.invite}
        onSubmit={handleSubmit(handleSendInvitationEmail)}
      >
        <ModalBody>
          <div className={styles.form}>
            <FormItem label='Email' description='send emails to user per line'>
              <Controller
                control={control}
                name='emails'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={1}
                    className={styles.form__text}
                    placeholder={t('placeholder.email')}
                  />
                )}
              />
              <ErrorMessage errors={errors} name='emails' />
            </FormItem>
            <FormItem label='Role' description='select your role'>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    className={styles.form__select}
                    instanceId='role_select'
                    placeholder={t('placeholder.select.role')}
                    options={roleOptions}
                  />
                )}
                name='role'
                control={control}
              />
              <ErrorMessage errors={errors} name='role' />
            </FormItem>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={handleCloseModal} kind={ButtonKind.tertiary}>
            {t('action.cancel')}
          </ModalButton>
          <ModalButton type='submit'>
            {t('action.send.mail.invitation')}
          </ModalButton>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default InviteUserModal
