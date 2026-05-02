import { EmbedLoomBlockSchema } from '@linvo-core/content';
import { BlockPlainTextAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockPlainTextAdapterMatcher } from '../../embed-shared/adapters/plain-text';

export const embedLoomBlockPlainTextAdapterMatcher =
  createEmbedBlockPlainTextAdapterMatcher(EmbedLoomBlockSchema.model.flavour);

export const EmbedLoomBlockPlainTextAdapterExtension =
  BlockPlainTextAdapterExtension(embedLoomBlockPlainTextAdapterMatcher);
