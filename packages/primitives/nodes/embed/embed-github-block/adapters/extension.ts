import type { ExtensionType } from '@linvo-core/store';

import { EmbedGithubBlockHtmlAdapterExtension } from './html';
import { EmbedGithubMarkdownAdapterExtension } from './markdown';
import { EmbedGithubBlockNotionHtmlAdapterExtension } from './notion-html';
import { EmbedGithubBlockPlainTextAdapterExtension } from './plain-text';

export const EmbedGithubBlockAdapterExtensions: ExtensionType[] = [
  EmbedGithubBlockHtmlAdapterExtension,
  EmbedGithubMarkdownAdapterExtension,
  EmbedGithubBlockPlainTextAdapterExtension,
  EmbedGithubBlockNotionHtmlAdapterExtension,
];
