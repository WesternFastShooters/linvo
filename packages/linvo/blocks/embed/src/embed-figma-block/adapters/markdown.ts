import { EmbedFigmaBlockSchema } from '@linvo/linvo-model';
import { BlockMarkdownAdapterExtension } from '@linvo/linvo-shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../common/adapters/markdown.js';

export const embedFigmaBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedFigmaBlockSchema.model.flavour);

export const EmbedFigmaMarkdownAdapterExtension = BlockMarkdownAdapterExtension(
  embedFigmaBlockMarkdownAdapterMatcher
);
