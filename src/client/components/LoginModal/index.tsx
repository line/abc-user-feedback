/* */
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, ROLE, SIZE as ModalSize, ModalProps } from 'baseui/modal'

/* */
import { LoginContainer } from '~/containers'

const schema = yup.object().shape({
  email: yup.string().email('not a email format').required(),
  password: yup.string().required()
})

interface Props extends ModalProps {
  onClose?: any
}

const LoginModal = (props: Props) => {
  const { onClose, isOpen } = props
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
