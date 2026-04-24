import { cpus } from 'node:os';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm(), vanillaExtractPlugin()],
  esbuild: {
    target: 'es2018',
  },
  resolve: {
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
});
