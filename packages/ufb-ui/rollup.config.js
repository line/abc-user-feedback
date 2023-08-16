import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [
    {
      dir: './dist',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
    {
      name: '@ufb/ui',
      file: 'dist/index.umd.js',
      format: 'umd',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
      include: ['src/**/*'],
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', outDir: 'dist' }),
    svgr({ exportType: 'named', icon: true }),
  ],
  external: ['react', 'react-dom'],
};
