/* */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import { useApp, useUser } from '~/hooks'
import { RequireLoginPage, AccountSettingContainer } from '~/containers'
import { Button, Input, FormItem, Divider } from '~/components'
import { updateUserSetting } from '~/service/user'
import { createContext } from 'vm'

const ProfilePage = () => {
  const { user, setUser } = useUser()
  const { enqueue } = useSnackbar()

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      nickname: user?.profile?.nickname
    }
  })

  const { config } = useApp()

  const { isDirty } = formState

  if (!user) {
    return <RequireLoginPage />
  }

  const handleSubmitSetting = async (payload) => {
    try {
      const profile = await updateUserSetting(payload)
      setUser({
        ...user,
        profile
      })

      enqueue({
        message: 'Success update profile',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    } catch (error) {
      enqueue({
        message: error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <AccountSettingContainer title='Profile'>
      <div className={styles.page}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(handleSubmitSetting)}
        >
          <FormItem
            label='Email'
            description='The address to receive an email from this service'
          >
            <div>{user.email}</div>
          </FormItem>
          {config.app.useNickname && (
            <FormItem
              label='Name'
              description='information that shown in user profile'
            >
              <Input {...register('nickname')} />
            </FormItem>
          )}
          <Button
            htmlType='submit'
            disabled={!isDirty}
            className={styles.form__submit}
          >
            Save
          </Button>
        </form>
        <Divider />
      </div>
    </AccountSettingContainer>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { service } = query
  return {
    props: {
      ...(await serverSideTranslations(service.locale, ['common']))
    }
  }
}

export default ProfilePage
