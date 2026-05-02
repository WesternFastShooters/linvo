import type { ExtensionType } from '@linvo-core/store';

import { ImageBlockHtmlAdapterExtension } from './html';
import { ImageBlockMarkdownAdapterExtension } from './markdown';
import { ImageBlockNotionHtmlAdapterExtension } from './notion-html';

export const ImageBlockAdapterExtensions: ExtensionType[] = [
  ImageBlockHtmlAdapterExtension,
  ImageBlockMarkdownAdapterExtension,
  ImageBlockNotionHtmlAdapterExtension,
];
