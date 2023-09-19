export const env = {
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  API_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:4000',
  SESSION_PASSWORD:
    process.env.SESSION_PASSWORD ||
    'complex_password_at_least_32_characters_long',
  NEXT_PUBLIC_MAX_DAYS: parseNumEnv(process.env.NEXT_PUBLIC_MAX_DAYS, 90),
};

function parseNumEnv(env, defaultvalue) {
  const result = parseInt(env, 10);
  if (isNaN(result)) return defaultvalue;
  return result;
}
