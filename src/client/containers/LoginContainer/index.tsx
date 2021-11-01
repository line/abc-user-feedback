/* */
import React, { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Check, Delete } from 'baseui/icon'
import { useSnackbar } from 'baseui/snackbar'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox'

/* */
import styles from './styles.module.scss'
import { useApp, useUser, useToggle } from '~/hooks'
import { requestSignUp, requestLogin } from '~/service/auth'
import google from '~/assets/btn_google_login.png'
import { LoginProvider } from '@/types'
import {
  Divider,
  Input,
  Button,
  ErrorMessage,
  FormItem,
  FindPasswordModal
} from '~/components'

enum AuthMode {
  SignUp,
  SignIn
}

const LoginContainer = () => {
  const { requesSocialLogin } = useUser()
  const { service, config } = useApp()
  const { enqueue } = useSnackbar()
  const [showFindPasswordModal, toggleShowFindPasswordModal] = useToggle(false)
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SignIn)
  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setError,
    formState,
    watch
  } = useFormContext()

  const { t } = useTranslation()

  const watchEmail = watch('email')
  const watchPassword = watch('password')
  const watchPasswordConfirm = watch('passwordConfirm')

  const { errors } = formState

  const handleToggleAuthMode = () => {
    if (authMode === AuthMode.SignIn) {
      setAuthMode(AuthMode.SignUp)
    } else if (authMode === AuthMode.SignUp) {
      setAuthMode(AuthMode.SignIn)
    }
  }

  const handleSignUp = async () => {
    const payload = getValues()

    if (payload.password !== payload.passwordConfirm) {
      setError('passwordConfirm', {
        type: 'manual',
        message: t('validation.password.reset_confirm')
      })
    } else {
      await requestSignUp({
        email: payload.email,
        password: payload.password
      })
      enqueue({
        message: `we send verify email to ${payload.email}`,
        startEnhancer: ({ size }) => <Check size={size} />
      })
    }
  }

  const handleLogin = async () => {
    try {
      const payload = getValues()
      await requestLogin({
        email: payload.email,
        password: payload.password,
        rememberEmail: payload.rememberEmail
      })

      window.location.href = '/'
    } catch {
      enqueue({
        message: t('validation.email_password'),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const handleClickGoogleLogin = (e) => {
    e.preventDefault()
    requesSocialLogin('google')
  }

  const handleSubmitEmail = async () => {
    const isValid = await trigger()

    if (isValid) {
      try {
        if (authMode === AuthMode.SignUp) {
          await handleSignUp()
        } else if (authMode === AuthMode.SignIn) {
          await handleLogin()
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          enqueue({
            message: error.response.data.message,
            startEnhancer: ({ size }) => <Delete size={size} />
          })
        } else {
          enqueue({
            message: `cannot send email. please contact the administrator`,
            startEnhancer: ({ size }) => <Delete size={size} />
          })
        }
      }
    }
  }

  const renderLoginButton = () => {
    if (service && service.isPrivate) {
      return null
    }

    return (
      <Button
        type='text'
        className={styles.email__register}
        onClick={handleToggleAuthMode}
      >
        {authMode === AuthMode.SignIn ? 'Register' : 'Login'}
      </Button>
    )
  }

  return (
    <div className={styles.login}>
      {service?.logoUrl && (
        <img src={service.logoUrl} className={styles.login__logo} alt='logo' />
      )}
      <div className={styles.login__title}>
        {service ? (
          <>
            Login to
            <b className={styles['login__title__service']}>{service?.name}</b>
          </>
        ) : (
          <>Login First</>
        )}
      </div>
      {config.email.enable && (
        <form
          className={styles.email}
          onSubmit={handleSubmit(handleSubmitEmail)}
        >
          <span className={styles.email__title}>
            {authMode === AuthMode.SignIn ? 'Login' : 'Register'}
          </span>
          <div className={styles.email__form}>
            <FormItem label='Email'>
              <Input
                className={styles.email__form__input}
                placeholder={t('placeholder.email')}
                {...register('email')}
              />
              <ErrorMessage errors={errors} name='email' />
            </FormItem>
            <FormItem label='Password'>
              <Input
                placeholder={t('placeholder.password')}
                type='password'
                className={styles.email__form__input}
                {...register('password')}
              />
              <div className={styles.email__form__action}>
                <Controller
                  name='rememberEmail'
                  control={control}
                  render={({ field: { onChange, ...rest } }) => (
                    <Checkbox
                      {...rest}
                      checked={getValues('rememberEmail')}
                      labelPlacement={LABEL_PLACEMENT.right}
                      onChange={(e: any) => {
                        setValue('rememberEmail', e.target.checked)
                      }}
                    >
                      {t('action.remember_email')}
                    </Checkbox>
                  )}
                />
                {authMode === AuthMode.SignIn && (
                  <Button
                    type='text'
                    className={styles.email__form__forgot}
                    onClick={toggleShowFindPasswordModal}
                  >
                    {t('action.password.forgot')}
                  </Button>
                )}
              </div>
              <ErrorMessage errors={errors} name='password' />
            </FormItem>
            {authMode === AuthMode.SignUp && (
              <FormItem label='Confirm Password'>
                <Input
                  placeholder={t('placeholder.password.confirm')}
                  type='password'
                  className={styles.email__form__input}
                  {...register('passwordConfirm')}
                />
                <ErrorMessage errors={errors} name='passwordConfirm' />
              </FormItem>
            )}
            <div>
              <Button
                className={styles.email__form__button}
                type='primary'
                htmlType='submit'
                disabled={
                  !watchEmail ||
                  !watchPassword ||
                  (authMode === AuthMode.SignUp && !watchPasswordConfirm)
                }
              >
                {t('action.login')}
              </Button>
              {renderLoginButton()}
            </div>
          </div>
        </form>
      )}
      {config.oauth[LoginProvider.Google].enable && (
        <>
          <Divider>Or Login with</Divider>
          <div className={styles.login__social}>
            <Image
              src={google}
              alt='Google Login'
              width={191}
              height={46}
              onClick={handleClickGoogleLogin}
            />
          </div>
        </>
      )}
      <FindPasswordModal
        isOpen={showFindPasswordModal}
        onClose={toggleShowFindPasswordModal}
      />
    </div>
  )
}

export default LoginContainer
