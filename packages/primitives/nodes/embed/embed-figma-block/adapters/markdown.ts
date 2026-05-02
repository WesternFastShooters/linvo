import { EmbedFigmaBlockSchema } from '@linvo-core/content';
import { BlockMarkdownAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../embed-shared/adapters/markdown';

export const embedFigmaBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedFigmaBlockSchema.model.flavour);

export const EmbedFigmaMarkdownAdapterExtension = BlockMarkdownAdapterExtension(
  embedFigmaBlockMarkdownAdapterMatcher
);
