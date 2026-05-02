import { EmbedFigmaBlockSchema } from '@linvo-core/content';
import { BlockPlainTextAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockPlainTextAdapterMatcher } from '../../embed-shared/adapters/plain-text';

export const embedFigmaBlockPlainTextAdapterMatcher =
  createEmbedBlockPlainTextAdapterMatcher(EmbedFigmaBlockSchema.model.flavour);

export const EmbedFigmaBlockPlainTextAdapterExtension =
  BlockPlainTextAdapterExtension(embedFigmaBlockPlainTextAdapterMatcher);
