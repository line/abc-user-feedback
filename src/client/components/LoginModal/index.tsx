/* */
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, ROLE, SIZE as ModalSize, ModalProps } from 'baseui/modal'
import { useTranslation } from 'next-i18next'

/* */
import { LoginContainer } from '~/containers'

interface Props extends ModalProps {
  onClose?: any
}

const LoginModal = (props: Props) => {
  const { onClose, isOpen } = props

  const { t } = useTranslation()

  const schema = yup.object().shape({
    email: yup.string().email(t('validation.email')).required(),
    password: yup.string().required(),
    rememberEmail: yup.boolean()
  })

  const methods = useForm({
    resolver: yupResolver(schema)
  })

  const { reset } = methods
  const handleCloseModal = () => {
    reset()
    onClose?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size={ModalSize.auto}
      role={ROLE.dialog}
    >
      <FormProvider {...methods}>
        <LoginContainer />
      </FormProvider>
      {/*<div className={styles.login__legal}>*/}
      {/*  By signing in you agree to Get Satisfaction's Terms of Service, Privacy*/}
      {/*  Policy and Cookie Policy. You may need to enable third-party cookies to*/}
      {/*  Sign In or Sign Up.*/}
      {/*</div>*/}
    </Modal>
  )
}

export default LoginModal
