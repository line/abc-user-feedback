import type { Config } from 'tailwindcss';

import ufbTailwind from '@ufb/tailwind';

export default {
  content: ['./src/**/*.tsx'],
  plugins: [ufbTailwind],
} satisfies Config;
