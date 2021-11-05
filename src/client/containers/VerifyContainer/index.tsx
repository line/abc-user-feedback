/* */
import React from 'react'
import * as yup from 'yup'
import { KIND as ButtonKind } from 'baseui/button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'baseui/snackbar'
import { Delete } from 'baseui/icon'
import { ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { Divider, ErrorMessage, FormItem, Input } from '~/components'
import { requestConfirm } from '~/service/auth'
import { useApp } from '~/hooks'

interface Props {
  email?: string
  code?: string
}

const VerifyContainer = (props: Props) => {
  const { email, code } = props

  const { config } = useApp()
  const { enqueue } = useSnackbar()
  const { t } = useTranslation()

  const schema = yup.object().shape({
    nickname: yup.string(),
    password: yup.string().required(),
    passwordConfirm: yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        t('validation.password.confirm')
      )
      .required()
  })

  const { register, formState, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  const watchPassword = watch('password')
  const watchPasswordConfirm = watch('passwordConfirm')

  const handleCompleteVerify = async (payload) => {
    try {
      await requestConfirm({
        password: payload.password,
        nickname: payload.nickname,
        code
      })

      window.location.href = '/'
    } catch (error) {
      enqueue({
        message: error.response.data.message,
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <div>
      <ModalHeader>{t('title.settings.profile')}</ModalHeader>
      <form onSubmit={handleSubmit(handleCompleteVerify)}>
        <ModalBody>
          <FormItem label={t('label.email')}>
            <span>{email}</span>
          </FormItem>
          {config.app.useNickname && (
            <FormItem label={t('label.password_new')}>
              <Input
                placeholder='nickname'
                className={styles.email__form__input}
                {...register('nickname')}
              />
              <ErrorMessage errors={errors} name='nickname' />
            </FormItem>
          )}
          <Divider />
          <FormItem label='Password'>
            <Input
              placeholder={t('placeholder.password.rule')}
              type='password'
              className={styles.email__form__input}
              {...register('password')}
            />
            <ErrorMessage errors={errors} name='password' />
          </FormItem>
          <FormItem label='Confirm Password'>
            <Input
              placeholder='password confirm'
              type='password'
              className={styles.email__form__input}
              {...register('passwordConfirm')}
            />
            <ErrorMessage errors={errors} name='passwordConfirm' />
          </FormItem>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind={ButtonKind.primary}
            type='submit'
            disabled={!watchPassword || !watchPasswordConfirm}
          >
            {t('action.save')}
          </ModalButton>
        </ModalFooter>
      </form>
    </div>
  )
}

export default VerifyContainer
