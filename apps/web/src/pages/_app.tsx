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
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { appWithTranslation } from 'next-i18next';

import { Toaster } from '@ufb/ui';

import 'react-datepicker/dist/react-datepicker.css';

import { TenantProvider } from '@/contexts/tenant.context';
import { UserProvider } from '@/contexts/user.context';

import '@/styles/react-datepicker.css';
import './_app.css';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
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
        <link rel="shortcut icon" href="/assets/images/logo.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <TenantProvider>
            <UserProvider>
              {getLayout(<Component {...pageProps} />)}
              <Toaster />
            </UserProvider>
          </TenantProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
