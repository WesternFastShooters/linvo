import type { ExtensionType } from '@linvo-core/store';

import { EmbedFigmaBlockHtmlAdapterExtension } from './html';
import { EmbedFigmaMarkdownAdapterExtension } from './markdown';
import { EmbedFigmaBlockNotionHtmlAdapterExtension } from './notion-html';
import { EmbedFigmaBlockPlainTextAdapterExtension } from './plain-text';

export const EmbedFigmaBlockAdapterExtensions: ExtensionType[] = [
  EmbedFigmaBlockHtmlAdapterExtension,
  EmbedFigmaMarkdownAdapterExtension,
  EmbedFigmaBlockPlainTextAdapterExtension,
  EmbedFigmaBlockNotionHtmlAdapterExtension,
];
