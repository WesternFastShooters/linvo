import type { ExtensionType } from '@linvo-core/store';

import { RootBlockHtmlAdapterExtension } from './html';
import { RootBlockMarkdownAdapterExtension } from './markdown';
import { RootBlockNotionHtmlAdapterExtension } from './notion-html';

export const RootBlockAdapterExtensions: ExtensionType[] = [
  RootBlockHtmlAdapterExtension,
  RootBlockMarkdownAdapterExtension,
  RootBlockNotionHtmlAdapterExtension,
];
