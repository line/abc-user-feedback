/* */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'baseui/snackbar'
import { Delete, Check } from 'baseui/icon'
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
import { RequireLoginPage } from '~/containers'
import { Button, Input, Header, FormItem, Divider } from '~/components'
import { updateUserSetting, deleteUser } from '~/service/user'

const SettingPage = () => {
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
      await deleteUser()
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
    <div className={styles.page}>
      <Header />
      <h2>User Setting</h2>
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
        <FormItem
          label='Name'
          description='information that shown in user profile'
        >
          <Input {...register('nickname')} />
        </FormItem>
        <Button
          htmlType='submit'
          disabled={!isDirty}
          className={styles.form__submit}
        >
          Save
        </Button>
      </form>
      <Divider />
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
  )
}

export default SettingPage
