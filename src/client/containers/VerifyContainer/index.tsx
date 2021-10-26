/* */
import React from 'react'
import * as yup from 'yup'
import { KIND as ButtonKind } from 'baseui/button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'baseui/snackbar'
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal'

/* */
import styles from './styles.module.scss'
import { Divider, ErrorMessage, FormItem, Input } from '~/components'
import { requestConfirm } from '~/service/auth'
import { useApp } from '~/hooks'
import { Delete } from 'baseui/icon'

const schema = yup.object().shape({
  nickname: yup.string(),
  password: yup.string().required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match')
    .required()
})

interface Props {
  email?: string
  code?: string
}

const VerifyContainer = (props: Props) => {
  const { email, code } = props

  const { config } = useApp()
  const { enqueue } = useSnackbar()

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
      <ModalHeader>Complete Sign Up</ModalHeader>
      <form onSubmit={handleSubmit(handleCompleteVerify)}>
        <ModalBody>
          <FormItem label='Email'>
            <span>{email}</span>
          </FormItem>
          {config.app.useNickname && (<FormItem label='Nickname'>
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
    </div>
  )
}

export default VerifyContainer
