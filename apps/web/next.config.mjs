import { fileURLToPath } from 'url';
import createJiti from 'jiti';

import * as i18nConfig from './next-i18next.config.js';

createJiti(fileURLToPath(import.meta.url))('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'production',
  i18n: i18nConfig.default.i18n,
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@ufb/react'],
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
  images: { remotePatterns: [{ hostname: '*' }] },
  webpack(config) {
    // @ts-ignore
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true, exportType: 'named' },
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
