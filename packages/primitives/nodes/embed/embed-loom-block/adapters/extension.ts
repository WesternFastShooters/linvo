import type { ExtensionType } from '@linvo-core/store';

import { EmbedLoomBlockHtmlAdapterExtension } from './html';
import { EmbedLoomMarkdownAdapterExtension } from './markdown';
import { EmbedLoomBlockNotionHtmlAdapterExtension } from './notion-html';
import { EmbedLoomBlockPlainTextAdapterExtension } from './plain-text';

export const EmbedLoomBlockAdapterExtensions: ExtensionType[] = [
  EmbedLoomBlockHtmlAdapterExtension,
  EmbedLoomMarkdownAdapterExtension,
  EmbedLoomBlockPlainTextAdapterExtension,
  EmbedLoomBlockNotionHtmlAdapterExtension,
];
