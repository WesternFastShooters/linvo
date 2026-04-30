import { EmbedGithubBlockSchema } from '@linvo/linvo-model';
import { BlockMarkdownAdapterExtension } from '@linvo/linvo-shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../common/adapters/markdown.js';

export const embedGithubBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedGithubBlockSchema.model.flavour);

export const EmbedGithubMarkdownAdapterExtension =
  BlockMarkdownAdapterExtension(embedGithubBlockMarkdownAdapterMatcher);
