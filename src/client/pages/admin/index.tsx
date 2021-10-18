/* */
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { useSnackbar } from 'baseui/snackbar'
import { Check } from 'baseui/icon'

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

const AdminRoot = () => {
  const { isLoading, isError, error, data } = useQuery<any, AxiosError>(
    'service',
    getService
  )

  const { enqueue } = useSnackbar()

  const { config } = useApp()

  const { register, handleSubmit, reset, setError, formState, control } =
    useForm()
  const { setService } = useApp()

  const { isDirty } = formState

  useEffect(() => {
    if (data) {
      reset(data)
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
      const service = await updateService(payload)
      setService(service)
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

export default AdminRoot
