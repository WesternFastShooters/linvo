import { EmbedGithubBlockSchema } from '@linvo-core/content';
import { BlockMarkdownAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../embed-shared/adapters/markdown';

export const embedGithubBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedGithubBlockSchema.model.flavour);

export const EmbedGithubMarkdownAdapterExtension =
  BlockMarkdownAdapterExtension(embedGithubBlockMarkdownAdapterMatcher);
