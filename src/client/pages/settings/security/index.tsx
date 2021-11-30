/* */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'baseui/button'
import { Input } from 'baseui/input'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { useUser } from '~/hooks'
import { RequireLoginPage, AccountSettingContainer } from '~/containers'
import { FormItem, Divider, ErrorMessage } from '~/components'
import { changePassword } from '~/service/user'
import { PASSWORD_REGEXP } from '@/constant'

const SecurityPage = () => {
  const { user } = useUser()
  const { enqueue } = useSnackbar()
  const { t } = useTranslation()

  const schema = yup.object().shape({
    currentPassword: yup.string().required(),
    newPassword: yup
      .string()
      .matches(PASSWORD_REGEXP, t('validation.password'))
      .required(),
    newPasswordConfirm: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], t('validation.password.confirm'))
      .required()
  })

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors, isDirty } = formState

  if (!user) {
    return <RequireLoginPage />
  }

  const handleChangePassword = async (payload) => {
    try {
      await changePassword({
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword
      })

      enqueue({
        message: t('snackbar.success.change.password'),
        startEnhancer: ({ size }) => <Check size={size} />
      })
      reset()
    } catch (error) {
      enqueue({
        message:
          t(error?.response?.data?.error) ?? error?.response?.data?.message,
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <AccountSettingContainer title={t('menu.password.change')}>
      <div className={styles.page}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <FormItem label={t('label.password_current')}>
            <Input
              {...register('currentPassword')}
              type='password'
              placeholder={t('placeholder.password.current')}
            />
            <ErrorMessage errors={errors} name='currentPassword' />
          </FormItem>
          <FormItem label={t('label.password_new')}>
            <Input
              {...register('newPassword')}
              type='password'
              placeholder={t('placeholder.password.rule')}
            />
            <ErrorMessage errors={errors} name='newPassword' />
          </FormItem>
          <FormItem label={t('label.password_confirm')}>
            <Input
              {...register('newPasswordConfirm')}
              type='password'
              placeholder={t('placeholder.password.confirm')}
            />
            <ErrorMessage errors={errors} name='newPasswordConfirm' />
          </FormItem>
          <Button type='submit' disabled={!isDirty}>
            {t('action.save')}
          </Button>
        </form>
        <Divider />
      </div>
    </AccountSettingContainer>
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

export default SecurityPage
