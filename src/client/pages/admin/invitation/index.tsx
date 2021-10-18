/* */
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { useSnackbar } from 'baseui/snackbar'
import { Check } from 'baseui/icon'

/* */
import styles from './styles.module.scss'
import {
  Button,
  Switch,
  Loading,
  FormItem,
  Textarea,
  ErrorMessage
} from '~/components'
import { getService, updateInvitation } from '~/service/service'
import {
  AdminPageContainer,
  ForbiddenContainer,
  InternalErrorContainer,
  UnauthorizedContainer
} from '~/containers'
import { useApp } from '~/hooks'

const AdminInvitationPage = () => {
  const { isLoading, isError, error, data } = useQuery<any, AxiosError>(
    'service',
    getService
  )

  const { handleSubmit, reset, setError, formState, control, watch } = useForm()
  const { setService } = useApp()
  const { enqueue } = useSnackbar()

  const watchIsRestrictDomain = watch('isRestrictDomain')

  const { errors, isDirty } = formState

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        allowDomains: data?.allowDomains?.join?.('\n')
      })
    }
  }, [data])

  if (isLoading) {
    return (
      <AdminPageContainer title='Setting Invitation'>
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
      const service = await updateInvitation(payload)
      setService(service)
      enqueue({
        message: 'Invitation updated',
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
    <AdminPageContainer title='Setting Invitation'>
      <form
        className={styles.form}
        onSubmit={handleSubmit(handleSubmitSetting)}
      >
        <FormItem
          label='Restrict Invitation'
          description='If you set it to true, you can only send email to allowed domain'
        >
          <Controller
            control={control}
            name='isRestrictDomain'
            render={({ field }) => <Switch {...field} />}
          />
        </FormItem>
        <FormItem label='Allow Domain' description='allow domain per line'>
          <Controller
            control={control}
            name='allowDomains'
            render={({ field }) => (
              <Textarea
                {...field}
                rows={6}
                className={styles.form__text}
                placeholder='google.com'
                disabled={!watchIsRestrictDomain}
              />
            )}
          />
          <ErrorMessage errors={errors} name='restrictDomains' />
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

export default AdminInvitationPage
