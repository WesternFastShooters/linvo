import { EmbedLoomBlockSchema } from '@linvo/linvo-model';
import { BlockMarkdownAdapterExtension } from '@linvo/linvo-shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../common/adapters/markdown.js';

export const embedLoomBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedLoomBlockSchema.model.flavour);

export const EmbedLoomMarkdownAdapterExtension = BlockMarkdownAdapterExtension(
  embedLoomBlockMarkdownAdapterMatcher
);
