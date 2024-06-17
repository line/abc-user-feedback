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
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { appWithTranslation } from 'next-i18next';

import { Toaster } from '@ufb/ui';

import type { NextPageWithLayout } from '@/shared/types';
import { TenantGuard } from '@/entities/tenant';
import { useUserStore } from '@/entities/user';

import sessionStorage from '@/libs/session-storage';
// NOTE: DON'T Change the following import order
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/react-datepicker.css';
import '@/shared/styles/global.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      }),
  );

  const getLayout = Component.getLayout ?? ((page) => page);
  const { setUser } = useUserStore();

  const initializeJwt = async () => {
    const { data } = await axios.get('/api/jwt');
    if (!data?.jwt) return;
    sessionStorage.setItem('jwt', data.jwt);
    setUser();
  };

  useEffect(() => {
    initializeJwt();
  }, []);

  return (
    <>
      <Head>
        <title>User Feedback</title>
        <link rel="shortcut icon" href="/assets/images/logo.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <TenantGuard>
          {getLayout(<Component {...pageProps} />)}
          <Toaster />
        </TenantGuard>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
