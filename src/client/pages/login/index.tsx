/* */
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import { LoginContainer } from '~/containers'

const LoginPage = () => {
  const { t } = useTranslation()
  const schema = yup.object().shape({
    email: yup.string().email(t('validation.email')).required(),
    password: yup.string().required()
  })

  const methods = useForm({
    resolver: yupResolver(schema)
  })

  return (
    <FormProvider {...methods}>
      <LoginContainer />
    </FormProvider>
  )
}

export const getServerSideProps = async ({ query }) => {
  return {
    props: {
      ...(await serverSideTranslations(query.service.locale, ['common']))
    }
  }
}

export default LoginPage
