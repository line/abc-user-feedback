/* */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSnackbar } from 'baseui/snackbar'
import { Delete } from 'baseui/icon'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import { useApp, useUser } from '~/hooks'
import { Input, Button, LoginModal, FormItem, ErrorMessage } from '~/components'
import { requestSetup } from '~/service/setup'
import { parseValidateError } from '~/utils/error'

const SetupPage = () => {
  const router = useRouter()
  const { setService } = useApp()
  const { enqueue } = useSnackbar()
  const { user } = useUser()
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

  const { register, handleSubmit, formState, setError } = useForm()
  const { errors } = formState

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true)
    }
  }, [])

  const handleSubmitSetup = async (payload) => {
    try {
      const { data } = await requestSetup(payload)
      setService(data)
      await router.push('/')
    } catch (error) {
      const { target, message, original } = parseValidateError(error)

      setError(target, {
        type: 'manual',
        message
      })

      enqueue({
        message: original ?? error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <div className={styles.setup}>
      <form className={styles.form} onSubmit={handleSubmit(handleSubmitSetup)}>
        {user && (
          <div>
            <h1>hi {user?.profile?.nickname}, you need to set up first</h1>
          </div>
        )}
        <h1>Setup Service</h1>
        <FormItem label='User feedback name' required>
          <Input {...register('name')} />
          <ErrorMessage errors={errors} name='name' />
        </FormItem>
        <FormItem label='Site logo url'>
          <Input {...register('logoUrl')} />
          <ErrorMessage errors={errors} name='logoUrl' />
        </FormItem>
        <Button htmlType='submit' className={styles.form__button}>
          Setup
        </Button>
      </form>
      <LoginModal isOpen={showLoginModal} />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { service } = query

  const props = {
    ...(await serverSideTranslations(service?.locale || 'en', ['common']))
  }

  if (service) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      },
      props
    }
  }

  return {
    props
  }
}

export default SetupPage
