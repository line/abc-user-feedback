import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import App from 'next/app'
import { QueryClientProvider } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { LightTheme, BaseProvider } from 'baseui'
import { SnackbarProvider, PLACEMENT, DURATION } from 'baseui/snackbar'
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'

/*  */
import '~/styles/index.scss'
import { createQueryClient } from '~/service/queryClient'
import { UserProvider } from '~/hooks/useUser'
import { AppProvider } from '~/hooks/useApp'
import { PrivateBlockContainer } from '~/containers'
import { styletron, debug } from '~/styletron'

const FeedbackApp = (props: any) => {
  const { Component, pageProps, currentUser, service, config, ...rest } = props
  const [queryClient] = useState(() => createQueryClient())
  const serviceName = service?.name ?? 'User Feedback'
  const router = useRouter()

  const showPrivateDescription = useMemo(() => {
    const isAlwaysPublic =
      router.pathname === '/invite/verify' ||
      router.pathname === '/reset/password' ||
      router.pathname === '/login'
    return !isAlwaysPublic && service?.isPrivate && !currentUser
  }, [router, service, currentUser])

  return (
    <>
      <Head>
        <title>{serviceName}</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, minimum-scale=1, user-scalable=no'
        />
        <link
          rel='shortcut icon'
          type='image/x-icon'
          href={service?.logoUrl ?? '/favicon.ico'}
        />
        <meta property='og:title' content={serviceName} />
        <meta
          property='og:description'
          content={service?.description}
          key='og:description'
        />
        <meta property='og:site_name' content={serviceName} />
        <meta property='og:title' content={serviceName} key='og:title' />
        <meta property='og:type' content='website' key='og:type' />
        <meta
          property='og:image'
          content={service?.logoUrl ?? '/favicon.ico'}
        />
        <meta
          property='description'
          content={service?.description}
          key='description'
        />
      </Head>
      <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <BaseProvider theme={LightTheme}>
          <SnackbarProvider
            placement={PLACEMENT.topRight}
            defaultDuration={DURATION.medium}
          >
            <QueryClientProvider client={queryClient}>
              <AppProvider service={service} config={config}>
                <UserProvider currentUser={currentUser}>
                  {showPrivateDescription ? (
                    <PrivateBlockContainer />
                  ) : (
                    <Component {...pageProps} {...rest} />
                  )}
                  <div id='modal' />
                </UserProvider>
              </AppProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </BaseProvider>
      </StyletronProvider>
    </>
  )
}

FeedbackApp.getInitialProps = async (context) => {
  const { ctx } = context
  const { query = {}, req } = ctx

  const appProps = await App.getInitialProps(context)

  return {
    ...appProps,
    ...query,
    ...req?.query
  }
}

export default appWithTranslation(FeedbackApp)
