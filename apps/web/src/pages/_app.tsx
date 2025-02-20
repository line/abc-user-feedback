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
import { Inter } from 'next/font/google';
import Head from 'next/head';
import type { DehydratedState } from '@tanstack/react-query';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { OverlayProvider } from '@toss/use-overlay';
import axios from 'axios';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';

import { Toaster, TooltipProvider } from '@ufb/react';

import { sessionStorage } from '@/shared';
import type { Jwt, NextPageWithLayout } from '@/shared/types';
import { TenantGuard } from '@/entities/tenant';
import { useUserStore } from '@/entities/user';

// NOTE: DON'T Change the following import order
import '@/shared/styles/global.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const inter = Inter({ subsets: ['latin'] });

interface PageProps {
  dehydratedState?: DehydratedState;
}

type AppPropsWithLayout = AppProps<PageProps> & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { dehydratedState, ...otherProps } = pageProps;

  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);
  const { setUser } = useUserStore();

  const initializeJwt = async () => {
    const { data } = await axios.get<{ jwt?: Jwt }>('/api/jwt');
    if (!data.jwt) return;
    sessionStorage.setItem('jwt', data.jwt);
    setUser();
  };

  useEffect(() => {
    void initializeJwt();
  }, []);

  return (
    <>
      <Head>
        <title>ABC User Feedback</title>
        <link rel="shortcut icon" href="/assets/images/logo.svg" />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <OverlayProvider>
            <HydrationBoundary state={dehydratedState}>
              <TooltipProvider>
                <TenantGuard>
                  {getLayout(<Component {...otherProps} />)}
                  <Toaster />
                </TenantGuard>
              </TooltipProvider>
            </HydrationBoundary>
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </OverlayProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
