/* */
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'baseui/snackbar'
import { Check } from 'baseui/icon'
import { Select } from 'baseui/select'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import { Button, Input, Switch, Loading, FormItem } from '~/components'
import { getService, updateService } from '~/service/service'
import {
  AdminPageContainer,
  ForbiddenContainer,
  InternalErrorContainer,
  UnauthorizedContainer
} from '~/containers'
import { useApp } from '~/hooks'
import { Locale } from '@/types'

const localeOptions = Object.entries(Locale).map(([label, id]) => ({
  label,
  id
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  logoUrl: yup.string().url(),
  entryPath: yup.string(),
  isPrivate: yup.boolean()
})

const AdminRoot = () => {
  const { isLoading, isError, error, data } = useQuery<any, AxiosError>(
    'service',
    getService
  )

  const { enqueue } = useSnackbar()

  const { t, i18n } = useTranslation()

  const { config, setService } = useApp()

  const { register, handleSubmit, reset, setError, formState, control } =
    useForm({
      resolver: yupResolver(schema)
    })

  const { isDirty } = formState

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        locale: localeOptions.find((o) => o.id === data.locale)
      })
    }
  }, [data])

  if (isLoading) {
    return (
      <AdminPageContainer title='Setting Service'>
        <Loading />
      </AdminPageContainer>
    )
  }

  if (isError) {
    if (error.response.status === 401) {
      return <UnauthorizedContainer />
    }
    if (error.response.status === 403) {
      return <ForbiddenContainer />
    }

    return <InternalErrorContainer />
  }

  const handleSubmitSetting = async (payload) => {
    try {
      const locale = payload.locale?.[0]?.id || 'en'
      const service = await updateService({
        ...payload,
        locale
      })

      setService(service)

      i18n.changeLanguage(locale)

      enqueue({
        message: 'Service updated',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    } catch (err) {
      const { name, message } = err?.response?.data
      setError(name, {
        type: 'manual',
        message
      })
    }
  }

  return (
    <AdminPageContainer title='Setting Service'>
      <form
        className={styles.form}
        onSubmit={handleSubmit(handleSubmitSetting)}
      >
        <FormItem
          label='Page Title'
          description='Used for service title, SEO purpose'
        >
          <Input {...register('name')} />
        </FormItem>
        <FormItem label='Logo URL'>
          <Input {...register('logoUrl')} />
        </FormItem>
        <FormItem
          label='Entry path'
          description='Path for first redirect after login or click logo'
        >
          <Input {...register('entryPath')} />
        </FormItem>
        <FormItem label='Locale'>
          <Controller
            control={control}
            name='locale'
            render={({ field: { onChange, ...rest } }) => {
              return (
                <Select
                  {...rest}
                  onChange={(params) => onChange(params.value)}
                  options={localeOptions}
                  placeholder=''
                />
              )
            }}
          />
        </FormItem>
        <FormItem
          label='Private Service'
          description={
            <>
              <div
                style={
                  config.email.enable
                    ? {}
                    : { textDecorationLine: 'line-through' }
                }
              >
                If you set it to private, only invited user, allowed user and
                already registered user can access this service
              </div>
              {!config.email.enable && (
                <div>private service need to smtp configutation</div>
              )}
            </>
          }
        >
          <Controller
            control={control}
            name='isPrivate'
            render={({ field }) => (
              <Switch {...field} disabled={!config.email.enable} />
            )}
          />
        </FormItem>
        <Button
          htmlType='submit'
          disabled={!isDirty}
          className={styles.form__submit}
        >
          Save
        </Button>
      </form>
    </AdminPageContainer>
  )
}

export const getServerSideProps = async ({ query }) => {
  return {
    props: {
      ...(await serverSideTranslations(query.service.locale, ['common']))
    }
  }
}

export default AdminRoot
