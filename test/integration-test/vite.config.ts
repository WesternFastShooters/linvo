import { resolve } from 'node:path';
import { cpus } from 'node:os';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [wasm(), vanillaExtractPlugin()],
    esbuild: {
      target: 'es2022',
    },
    resolve: {
      alias: [
        {
          find: '@theme/style.css',
          replacement: resolve(__dirname, '../../resources/theme/dist/style.css'),
        },
        {
          find: '@theme/fonts.css',
          replacement: resolve(__dirname, '../../resources/theme/fonts/fonts.css'),
        },
        {
          find: '@theme/v2',
          replacement: resolve(__dirname, '../../resources/theme/dist/v2/index.js'),
        },
        {
          find: '@theme',
          replacement: resolve(__dirname, '../../resources/theme/dist/index.js'),
        },
        {
          find: '@icons/lit',
          replacement: resolve(__dirname, '../../resources/icons/dist/lit.mjs'),
        },
        {
          find: '@icons/rc',
          replacement: resolve(__dirname, '../../resources/icons/dist/rc.mjs'),
        },
      ],
      extensions: ['.ts', '.js'],
    },
    server: {
      host: true,
      allowedHosts: true,
    },
    build: {
      target: 'es2022',
      sourcemap: true,
      rollupOptions: {
        cache: false,
        maxParallelFileOps: Math.max(1, cpus().length - 1),
        onwarn(warning, defaultHandler) {
          if (
            warning.code &&
            ['EVAL', 'SOURCEMAP_ERROR'].includes(warning.code)
          ) {
            return;
          }
          defaultHandler(warning);
        },
        treeshake: true,
      },
    },
  };
});
