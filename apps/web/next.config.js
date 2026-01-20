import { fileURLToPath } from 'url';
import createJiti from 'jiti';

import * as i18nConfig from './next-i18next.config.js';

createJiti(fileURLToPath(import.meta.url))('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18nConfig.default.i18n,
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ['@ufb/react'],
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
  images: { remotePatterns: [{ hostname: '*' }] },
  devIndicators: false,
};

export default nextConfig;
