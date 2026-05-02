import type { ExtensionType } from '@linvo-core/store';

import { EmbedYoutubeBlockHtmlAdapterExtension } from './html';
import { EmbedYoutubeMarkdownAdapterExtension } from './markdown';
import { EmbedYoutubeBlockNotionHtmlAdapterExtension } from './notion-html';
import { EmbedYoutubeBlockPlainTextAdapterExtension } from './plain-text';

export const EmbedYoutubeBlockAdapterExtensions: ExtensionType[] = [
  EmbedYoutubeBlockHtmlAdapterExtension,
  EmbedYoutubeMarkdownAdapterExtension,
  EmbedYoutubeBlockPlainTextAdapterExtension,
  EmbedYoutubeBlockNotionHtmlAdapterExtension,
];
