import './src/env.mjs';

import path from 'path';
import { fileURLToPath } from 'url';

import i18nConfig from './next-i18next.config.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'production',
  swcMinify: true,
  i18n: i18nConfig.i18n,
  output: 'standalone',
  experimental: { outputFileTracingRoot: path.join(__dirname, '../../') },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@ufb/ui'],
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
  images: { remotePatterns: [{ hostname: '*' }] },
  webpack(config) {
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

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
