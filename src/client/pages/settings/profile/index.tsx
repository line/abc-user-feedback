/* */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
import { useRouter } from 'next/router'
import { KIND as ButtonKind } from 'baseui/button'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE
} from 'baseui/modal'

/* */
import styles from './styles.module.scss'
import { useApp, useUser, useToggle } from '~/hooks'
import { RequireLoginPage, AccountSettingContainer } from '~/containers'
import { Button, Input, FormItem, Divider } from '~/components'
import { updateUserSetting, deleteSelfUser } from '~/service/user'

const ProfilePage = () => {
  const { user, setUser } = useUser()
  const { enqueue } = useSnackbar()
  const { t } = useTranslation()

  const [showDeleteModal, setToggleDeleteModal] = useToggle(false)

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      nickname: user?.profile?.nickname
    }
  })

  const router = useRouter()
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

  const handleDeleteAccount = async () => {
    try {
      await deleteSelfUser()
      setToggleDeleteModal()
      setUser(null)
      enqueue({
        message: 'Success delete account',
        startEnhancer: ({ size }) => <Check size={size} />
      })
      await router.push('/')
    } catch (error) {
      enqueue({
        message: error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <AccountSettingContainer title={t('menu.account')}>
      <div className={styles.page}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(handleSubmitSetting)}
        >
          <FormItem
            label={t('label.email')}
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
          {config.app.useNickname && (
            <Button
              htmlType='submit'
              disabled={!isDirty}
              className={styles.form__submit}
            >
              Save
            </Button>
          )}
        </form>
        <Divider />
        <div className={styles.account}>
          <FormItem
            label={t('title.account.delete')}
            description='delete all your information'
          >
            <Button
              className={styles.account__delete}
              onClick={setToggleDeleteModal}
            >
              {t('action.account.delete')}
            </Button>
          </FormItem>
        </div>
        <Modal
          closeable
          onClose={setToggleDeleteModal}
          isOpen={showDeleteModal}
          animate
          autoFocus
          size={SIZE.default}
          role={ROLE.dialog}
        >
          <ModalHeader>{t('title.account.delete')}</ModalHeader>
          <ModalBody>{t('confirm.account.delete')}</ModalBody>
          <ModalFooter>
            <ModalButton
              kind={ButtonKind.tertiary}
              onClick={setToggleDeleteModal}
            >
              {t('action.cancel')}
            </ModalButton>
            <ModalButton onClick={handleDeleteAccount}>
              {t('action.delete')}
            </ModalButton>
          </ModalFooter>
        </Modal>
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

export default ProfilePage
