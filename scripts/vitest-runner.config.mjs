import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { defineConfig, mergeConfig } from 'vite';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const packageDir = process.env.VITEST_PACKAGE_DIR;

if (!packageDir) {
  throw new Error('VITEST_PACKAGE_DIR is required.');
}

const baseConfig = defineConfig({
  esbuild: {
    target: 'es2018',
  },
  resolve: {
    alias: [
      {
        find: '@theme/style.css',
        replacement: resolve(rootDir, 'resources/theme/dist/style.css'),
      },
      {
        find: '@theme/fonts.css',
        replacement: resolve(rootDir, 'resources/theme/fonts/fonts.css'),
      },
      {
        find: '@theme/v2',
        replacement: resolve(rootDir, 'resources/theme/dist/v2/index.js'),
      },
      {
        find: '@theme',
        replacement: resolve(rootDir, 'resources/theme/dist/index.js'),
      },
      {
        find: '@icons/lit',
        replacement: resolve(rootDir, 'resources/icons/dist/lit.mjs'),
      },
      {
        find: '@icons/rc',
        replacement: resolve(rootDir, 'resources/icons/dist/rc.mjs'),
      },
    ],
    extensions: ['.ts', '.js'],
  },
});

async function loadConfig(filePath, env) {
  const mod = await import(pathToFileURL(filePath).href);
  const config = mod.default ?? mod;

  return typeof config === 'function' ? await config(env) : config;
}

export default defineConfig(async env => {
  const vitestConfigPath = resolve(packageDir, 'vitest.config.ts');
  const viteConfigPath = resolve(packageDir, 'vite.config.ts');

  let packageConfig = {};
  if (await access(vitestConfigPath).then(() => true).catch(() => false)) {
    packageConfig = await loadConfig(vitestConfigPath, env);
  } else if (await access(viteConfigPath).then(() => true).catch(() => false)) {
    packageConfig = await loadConfig(viteConfigPath, env);
  }

  return mergeConfig(baseConfig, packageConfig);
});
