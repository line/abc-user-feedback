import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

import 'dotenv/config';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ABC User Feedback',
  tagline:
    'ABC User Feedback is a standalone web application designed to manage Voice of Customer (VoC) data',
  favicon: 'img/logo.svg',
  url: 'https://docs.abc-user-feedback.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en', 'ja'],
    localeConfigs: {
      ko: {
        label: '한국어',
        direction: 'ltr',
      },
      en: {
        label: 'English',
        direction: 'ltr',
      },
      ja: {
        label: '日本語',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/line/abc-user-feedback/tree/feat/docs/apps/docs',
        },
        gtag: {
          trackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? '',
          anonymizeIP: true,
        },
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'ABC User Feedback',
      logo: { alt: 'LOGO', src: 'img/logo.svg' },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/line/abc-user-feedback',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    metadata: [
      {
        name: 'google-site-verification',
        content: process.env.GOOGLE_SITE_VERIFICATION, // Replace with your actual code
      },
    ],
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} ABC User Feedback.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
