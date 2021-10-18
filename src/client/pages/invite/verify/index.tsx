/* */
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
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
import { ErrorMessage, FormItem, Header, Input } from '~/components'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { requestConfirm } from '~/service/auth'

const schema = yup.object().shape({
  password: yup.string().required()
})

const VerifyPage = ({ email, code }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    setShowModal(true)
  }, [])

  const { register, formState, watch, setError, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  const watchPassword = watch('password')
  const watchPasswordConfirm = watch('passwordConfirm')

  const handleCompleteVerify = async (payload) => {
    if (payload.password !== payload.passwordConfirm) {
      setError('passwordConfirm', {
        type: 'manual',
        message: 'passwords must match'
      })
    } else {
      await requestConfirm({
        password: payload.password,
        code
      })

      window.location.href = '/'
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
        <ModalHeader>Complete Sign Up</ModalHeader>
        <form onSubmit={handleSubmit(handleCompleteVerify)}>
          <ModalBody>
            <FormItem label='Email'>
              <span>{email}</span>
            </FormItem>
            <FormItem label='Password'>
              <Input
                placeholder='password'
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
              Submit
            </ModalButton>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}

export default VerifyPage
