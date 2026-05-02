import { resolve } from 'node:path';
import { cpus } from 'node:os';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

function packageAlias(
  scope: string,
  publicRoot: string,
  fsRoot: string
) {
  return [
    {
      find: new RegExp(`^${scope}/${publicRoot}$`),
      replacement: resolve(__dirname, fsRoot, 'index.ts'),
    },
    {
      find: new RegExp(`^${scope}/${publicRoot}/(.*)$`),
      replacement: `${resolve(__dirname, fsRoot)}/$1`,
    },
  ];
}

function exactAlias(specifier: string, fsPath: string) {
  return {
    find: specifier,
    replacement: resolve(__dirname, fsPath),
  };
}

export default defineConfig({
  plugins: [wasm(), vanillaExtractPlugin()],
  esbuild: {
    target: 'es2018',
  },
  resolve: {
    alias: [
      exactAlias(
        '@linvo-core/block-root/edgeless-block',
        'packages/core/runtime/block-edgeless-root/edgeless/edgeless-root-block.ts'
      ),
      exactAlias(
        '@linvo-core/turbo-renderer/painter',
        'packages/core/runtime/turbo-renderer/painter/painter.worker.ts'
      ),
      exactAlias(
        '@linvo-primitives/connector/view',
        'packages/primitives/elements/connector/view-extension.ts'
      ),
      exactAlias(
        '@linvo-primitives/mindmap/view',
        'packages/primitives/elements/mindmap/view-extension.ts'
      ),
      ...packageAlias('@linvo-core', 'composition', 'packages/core/framework/composition'),
      ...packageAlias('@linvo-core', 'global', 'packages/core/framework/global'),
      ...packageAlias('@linvo-core', 'std', 'packages/core/framework/std'),
      ...packageAlias('@linvo-core', 'store', 'packages/core/framework/store'),
      ...packageAlias('@linvo-core', 'content', 'packages/core/runtime/content'),
      ...packageAlias('@linvo-core', 'foundation', 'packages/core/runtime/foundation-base'),
      ...packageAlias('@linvo-core', 'shared', 'packages/core/runtime/shared-base'),
      ...packageAlias('@linvo-core', 'block-surface', 'packages/core/runtime/block-surface'),
      ...packageAlias('@linvo-core', 'block-root', 'packages/core/runtime/block-edgeless-root'),
      ...packageAlias('@linvo-core', 'turbo-renderer', 'packages/core/runtime/turbo-renderer'),
      ...packageAlias('@linvo-primitives', 'brush', 'packages/primitives/elements/brush'),
      ...packageAlias('@linvo-primitives', 'connector', 'packages/primitives/elements/connector'),
      ...packageAlias('@linvo-primitives', 'group', 'packages/primitives/elements/group'),
      ...packageAlias('@linvo-primitives', 'mindmap', 'packages/primitives/elements/mindmap'),
      ...packageAlias('@linvo-primitives', 'pointer', 'packages/primitives/elements/pointer'),
      ...packageAlias('@linvo-primitives', 'shape', 'packages/primitives/elements/shape'),
      ...packageAlias('@linvo-primitives', 'text', 'packages/primitives/elements/text'),
      ...packageAlias('@linvo-primitives', 'attachment', 'packages/primitives/nodes/attachment'),
      ...packageAlias('@linvo-primitives', 'embed', 'packages/primitives/nodes/embed'),
      ...packageAlias('@linvo-primitives', 'frame', 'packages/primitives/nodes/frame'),
      ...packageAlias('@linvo-primitives', 'image', 'packages/primitives/nodes/image'),
      ...packageAlias('@linvo-ui', 'components', 'packages/ui/components-base'),
      ...packageAlias('@linvo-ui', 'edgeless-dragging-area', 'packages/ui/edgeless-dragging-area'),
      ...packageAlias('@linvo-ui', 'edgeless-selected-rect', 'packages/ui/edgeless-selected-rect'),
      ...packageAlias('@linvo-ui', 'edgeless-toolbar', 'packages/ui/edgeless-toolbar'),
      ...packageAlias('@linvo-ui', 'edgeless-zoom-toolbar', 'packages/ui/edgeless-zoom-toolbar'),
      ...packageAlias('@linvo-ui', 'frame-title', 'packages/ui/frame-title'),
      ...packageAlias('@linvo-ui', 'scroll-anchoring', 'packages/ui/scroll-anchoring'),
      ...packageAlias('@linvo-ui', 'viewport-overlay', 'packages/ui/viewport-overlay'),
      ...packageAlias('@linvo-integrations', 'mermaid', 'packages/integrations/mermaid'),
      {
        find: '@theme/style.css',
        replacement: resolve(__dirname, 'resources/theme/dist/style.css'),
      },
      {
        find: '@theme/fonts.css',
        replacement: resolve(__dirname, 'resources/theme/fonts/fonts.css'),
      },
      {
        find: '@theme/v2',
        replacement: resolve(__dirname, 'resources/theme/dist/v2/index.js'),
      },
      {
        find: '@theme',
        replacement: resolve(__dirname, 'resources/theme/dist/index.js'),
      },
      {
        find: '@icons/lit',
        replacement: resolve(__dirname, 'resources/icons/dist/lit.mjs'),
      },
      {
        find: '@icons/rc',
        replacement: resolve(__dirname, 'resources/icons/dist/rc.mjs'),
      },
    ],
    extensions: ['.ts', '.js'],
  },
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api/worker': {
        target: 'https://linvo-worker.toeverything.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
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
