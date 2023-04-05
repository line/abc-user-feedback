/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import {
  ChakraProvider,
  StyleConfig,
  defineStyleConfig,
  extendTheme,
} from '@chakra-ui/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { RecoilRoot } from 'recoil';

import { UserProvider } from '@/contexts/user.context';
import '@/styles/react-datepicker.css';

import './_app.css';

const buttonTheme = defineStyleConfig({
  defaultProps: { colorScheme: 'primary', size: 'sm' },
});

const components: Record<string, StyleConfig | any> = {
  Form: {
    defaultProps: {
      variant: 'floating',
    },
    variants: {
      floating: {},
    },
  },
  Tabs: {
    baseStyle: {
      tab: {
        fontFamily: `"Noto Sans", sans-serif`,
      },
    },
  },
  Card: {
    baseStyle: {
      container: { background: 'white' },
    },
  },
  Container: {
    baseStyle: {
      maxW: '1400px',
      overflowX: 'auto',
    },
  },
  Heading: {
    defaultProps: {
      size: 'md',
    },
  },
  Table: {
    baseStyle: {
      th: {
        border: '1px',
        bg: 'blackAlpha.50',
      },
      td: {
        border: '1px',
        fontSize: 'sm',
      },
    },
  },
  Button: buttonTheme,
};

const theme = extendTheme({
  components,
  fonts: {
    body: `"Noto Sans", sans-serif`,
    heading: `"Noto Sans", sans-serif`,
    mono: `"Noto Sans", sans-serif`,
  },

  styles: {
    global: {
      body: {
        bg: '#F5F5F5',
      },
    },
  },
  semanticTokens: {
    colors: {
      primary: { default: '#326edc' },
      secondary: { default: '#F2F6FD' },
    },
  },
  colors: {
    primary: {
      main: '#326edc',
      50: '#adc5f1',
      100: '#99b7ee',
      200: '#84a8ea',
      300: '#709ae7',
      400: '#5b8be3',
      500: '#326edc',
      600: '#2d63c6',
      700: '#234d9a',
      800: '#19376e',
      900: '#0f2142',
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>User Feedback</title>
        <link rel="shortcut icon" href="/assets/favicon.ico" />
      </Head>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <UserProvider>
                {getLayout(<Component {...pageProps} />)}
              </UserProvider>
            </Hydrate>
          </QueryClientProvider>
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
}

export default appWithTranslation(App);
