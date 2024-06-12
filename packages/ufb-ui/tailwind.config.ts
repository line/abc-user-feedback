import type { Config } from 'tailwindcss';

import ufbTailwind from '@ufb/tailwind';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [ufbTailwind],
} satisfies Config;
