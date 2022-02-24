/* */
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ROLE,
  SIZE
} from 'baseui/modal'
import { useTranslation } from 'next-i18next'
import { KIND as ButtonKind } from 'baseui/button'

/* */
import styles from './styles.module.scss'
import { sendInvitationEmail } from '~/service/mail'
import { ErrorMessage, FormItem, Textarea } from '~/components'
import { useApp, useOAIQuery, useUser } from '~/hooks'
import { OWNER_KEY } from '@/constant'
import { Permission } from '@/types'

interface Props extends ModalProps {
  onClose?: any
}

const InviteUserModal = (props: Props) => {
  const { onClose, isOpen } = props

  const { t } = useTranslation()

  const { isLoading, data } = useOAIQuery({
    queryKey: '/api/v1/admin/roles',
    queryOptions: {
      enabled: isOpen
    }
  })

  const schema = yup.object().shape({
    emails: yup
      .string()
      .test('email format', t('validation.email.domain'), (emails = '') => {
        const emailSchema = yup.string().email()
        const parsed = emails
          .split(/\n/)
          .filter((email) => email)
          .map((email) => email.trim())

        return parsed.every((email) => emailSchema.isValidSync(email))
      })
      .required(t('validation.email.domain')),
    role: yup.mixed().required(t('validation.select.role'))
  })

  const { user, hasPermission } = useUser()
  const { service } = useApp()
  const { enqueue } = useSnackbar()

  const { handleSubmit, control, reset, formState, setError, clearErrors } =
    useForm({
      resolver: yupResolver(schema)
    })

  const roleOptions = useMemo(() => {
    const options = []

    if (hasPermission(Permission.MANAGE_ALL)) {
      options.push({ key: OWNER_KEY, value: OWNER_KEY, label: 'owner' })
    }

    if (data?.results) {
      data.results
        ?.filter((r) => r.name !== OWNER_KEY)
        ?.map((r) => {
          options.push({ key: r.name, value: r.name, label: r.name })
        })
    }

    return options
  }, [data])

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
              message: t('validation.email.domain')
            })

            break
          }
        }
      }

      if (flag) {
        await Promise.all(
          emails.map((email) =>
            sendInvitationEmail({ email: email.trim(), roleName: role.value })
          )
        )
        enqueue({
          message: t('snackbar.success.send.mail.invitation'),
          startEnhancer: ({ size }) => <Check size={size} />
        })
        handleCloseModal()
      }
    } catch (error) {
      enqueue({
        message:
          t(error?.response?.data?.error) ?? error?.response?.data?.message,
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
            <FormItem
              label='Email'
              description={t('placeholder.invitation.mail')}
            >
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
            <FormItem label='Role'>
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
