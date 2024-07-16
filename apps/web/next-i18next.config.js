/** @type {import('next-i18next').UserConfig} */
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en', 'ja', 'ko', 'zh'],
  },
  fallbackLng: {
    default: ['en'],
  },
  nonExplicitSupportedLngs: true,
};
