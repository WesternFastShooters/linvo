import { EmbedLoomBlockSchema } from '@linvo-core/content';
import { BlockMarkdownAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../embed-shared/adapters/markdown';

export const embedLoomBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedLoomBlockSchema.model.flavour);

export const EmbedLoomMarkdownAdapterExtension = BlockMarkdownAdapterExtension(
  embedLoomBlockMarkdownAdapterMatcher
);
