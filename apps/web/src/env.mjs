/* eslint-disable @typescript-eslint/no-non-null-assertion */

export const env = {
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  API_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:4000',
  SESSION_PASSWORD:
    process.env.SESSION_PASSWORD ||
    'complex_password_at_least_32_characters_long',
  NEXT_PUBLIC_MAX_DAYS: +(process.env.NEXT_PUBLIC_MAX_DAYS || 90),
};
