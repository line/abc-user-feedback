/* */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { KIND as ButtonKind } from 'baseui/button'
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
import { useUser, useToggle } from '~/hooks'
import { RequireLoginPage, AccountSettingContainer } from '~/containers'
import { Button, Input, FormItem, Divider } from '~/components'
import { updateUserSetting, deleteSelfUser } from '~/service/user'

const AccountPage = () => {
  const { user, setUser } = useUser()
  const router = useRouter()
  const [showDeleteModal, setToggleDeleteModal] = useToggle(false)
  const { enqueue } = useSnackbar()

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      nickname: user?.profile?.nickname
    }
  })

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
    <AccountSettingContainer title='Account'>
      <div className={styles.page}>
        <div className={styles.account}>
          <FormItem
            label='Delete Account'
            description='delete all your information'
          >
            <Button
              className={styles.account__delete}
              onClick={setToggleDeleteModal}
            >
              Delete Account
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
          <ModalHeader>Delete Account</ModalHeader>
          <ModalBody>Remove all your information</ModalBody>
          <ModalFooter>
            <ModalButton
              kind={ButtonKind.tertiary}
              onClick={setToggleDeleteModal}
            >
              Cancel
            </ModalButton>
            <ModalButton onClick={handleDeleteAccount}>Confirm</ModalButton>
          </ModalFooter>
        </Modal>
      </div>
    </AccountSettingContainer>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {
      ...(await serverSideTranslations('en', ['common']))
    }
  }
}


export default AccountPage

