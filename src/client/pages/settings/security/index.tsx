/* */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'baseui/button'
import { Input } from 'baseui/input'

/* */
import styles from './styles.module.scss'
import { useUser } from '~/hooks'
import { RequireLoginPage, AccountSettingContainer } from '~/containers'
import { FormItem, Divider, ErrorMessage } from '~/components'
import { changePassword } from '~/service/user'

const schema = yup.object().shape({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
  newPasswordConfirm: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'passwords must match')
    .required()
})

const SecurityPage = () => {
  const { user } = useUser()
  const { enqueue } = useSnackbar()

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
        message: 'Success change password',
        startEnhancer: ({ size }) => <Check size={size} />
      })
      reset()
    } catch (error) {
      enqueue({
        message: error?.response?.data?.message,
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <AccountSettingContainer title='Change Password'>
      <div className={styles.page}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <FormItem label='Current password'>
            <Input {...register('currentPassword')} type='password' />
            <ErrorMessage errors={errors} name='currentPassword' />
          </FormItem>
          <FormItem label='New password'>
            <Input {...register('newPassword')} type='password' />
            <ErrorMessage errors={errors} name='newPassword' />
          </FormItem>
          <FormItem label='Confirm new Password'>
            <Input {...register('newPasswordConfirm')} type='password' />
            <ErrorMessage errors={errors} name='newPasswordConfirm' />
          </FormItem>
          <Button type='submit' disabled={!isDirty}>
            Save
          </Button>
        </form>
        <Divider />
      </div>
    </AccountSettingContainer>
  )
}

export default SecurityPage
