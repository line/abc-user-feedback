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

import { faker } from '@faker-js/faker';
import nextRouterMock from 'next-router-mock';

import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
// headless-ui
global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

afterEach(() => jest.resetAllMocks());

jest.mock('next/router', () => ({
  useRouter: () => nextRouterMock,
}));

jest.mock('@t3-oss/env-nextjs', () => ({
  createEnv: () => ({
    NEXT_PUBLIC_MAX_DAYS: process.env.NEXT_PUBLIC_MAX_DAYS,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  }),
}));

faker.seed(100);
