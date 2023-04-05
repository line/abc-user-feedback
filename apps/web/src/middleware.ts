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
import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse, URLPattern } from 'next/server';

import { ironOption } from '@/constants/iron-option';

import { INIT_PATH, PATH } from './constants/path';

const AUTHENTICATED_PAGES = [
  '/dashboard',
  '/project-management/:path*',
  '/setting/:path*',
];
const SIGN_PAGES = ['/auth/:path*'];

// Unsupported spread operator in the Array Expression at "config.matcher".
// The default config will be used instead.
// Read More - https://nextjs.org/docs/messages/invalid-page-config
// export const config = { matcher: [...AUTHENTICATED_PAGES, ...SIGN_PAGES] };

export const config = {
  matcher: [
    '/dashboard',
    '/project-management/:path*',
    '/setting/:path*',
    '/auth/:path*',
  ],
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, ironOption);
  // const { status } = await fetch(
  //   new URL(`${process.env.API_BASE_URL}/api/tenant`).href,
  // );
  // if (status === 404) {
  //   return NextResponse.redirect(new URL(PATH.TENANT_INITIAL_SETTING, req.url));
  // }

  if (isPage(AUTHENTICATED_PAGES, req.url) && !session.jwt) {
    const redirectUrl = new URL(PATH.AUTH.SIGN_IN, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPage(SIGN_PAGES, req.url) && session.jwt) {
    const redirectUrl = new URL(INIT_PATH, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
};

const isPage = (pages: string[], url: string) => {
  for (const page of pages) {
    const pattern = new URLPattern({ pathname: page });
    if (pattern.test(url)) return true;
  }
  return false;
};
