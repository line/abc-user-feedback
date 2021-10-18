/* */
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { KIND as ButtonKind } from 'baseui/button'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE
} from 'baseui/modal'
import { Input } from 'baseui/input'

/* */
import styles from './styles.module.scss'
import { ErrorMessage, FormItem, Header } from '~/components'
import { requestChangePassword } from '~/service/auth'

const schema = yup.object().shape({
  password: yup.string().required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match')
})

const ResetPasswordPage = ({ code }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { enqueue } = useSnackbar()
  const router = useRouter()

  useEffect(() => {
    setShowModal(true)
  }, [])

  const { register, formState, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  const watchPassword = watch('password')
  const watchPasswordConfirm = watch('passwordConfirm')

  const handleResetPassword = async (payload) => {
    try {
      await requestChangePassword({
        password: payload.password,
        code
      })

      await router.push('/')
      enqueue({
        message: 'Success change password',
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
    <div className={styles.container}>
      <Header />
      <Modal
        isOpen={showModal}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Reset Password</ModalHeader>
        <form onSubmit={handleSubmit(handleResetPassword)}>
          <ModalBody>
            <FormItem label='Password'>
              <Input
                placeholder='password'
                type='password'
                {...register('password')}
              />
              <ErrorMessage errors={errors} name='password' />
            </FormItem>
            <FormItem label='Confirm Password'>
              <Input
                placeholder='password confirm'
                type='password'
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
              Submit
            </ModalButton>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}

export default ResetPasswordPage
