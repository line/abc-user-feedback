/* */
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import { LoginContainer } from '~/containers'

interface Props {
  loginEmail?: string
}

const LoginPage = (props: Props) => {
  const { t } = useTranslation()
  const schema = yup.object().shape({
    email: yup.string().email(t('validation.email.domain')).required(),
    password: yup.string().required(),
    rememberEmail: yup.boolean()
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rememberEmail: !!props?.loginEmail,
      email: props?.loginEmail
    }
  })

  return (
    <FormProvider {...methods}>
      <LoginContainer />
    </FormProvider>
  )
}

export const getServerSideProps = async ({ req, query }) => {
  const locale = query?.service?.locale || 'en'

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      loginEmail: req?.cookies?.loginMail ?? ''
    }
  }
}

export default LoginPage
