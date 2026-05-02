import {
  EdgelessSurfaceBlockMarkdownAdapterExtension,
  SurfaceBlockMarkdownAdapterExtension,
} from './markdown/markdown';
import {
  EdgelessSurfaceBlockPlainTextAdapterExtension,
  SurfaceBlockPlainTextAdapterExtension,
} from './plain-text/plain-text';

export const SurfaceBlockAdapterExtensions = [
  SurfaceBlockPlainTextAdapterExtension,
  SurfaceBlockMarkdownAdapterExtension,
];

export const EdgelessSurfaceBlockAdapterExtensions = [
  EdgelessSurfaceBlockPlainTextAdapterExtension,
  EdgelessSurfaceBlockMarkdownAdapterExtension,
];

export * from './markdown/element-adapter';
export * from './plain-text/element-adapter';
