import { EmbedFigmaBlockSchema } from '@linvo-core/content';
import { BlockHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockHtmlAdapterMatcher } from '../../embed-shared/adapters/html';

export const embedFigmaBlockHtmlAdapterMatcher =
  createEmbedBlockHtmlAdapterMatcher(EmbedFigmaBlockSchema.model.flavour);

export const EmbedFigmaBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  embedFigmaBlockHtmlAdapterMatcher
);
