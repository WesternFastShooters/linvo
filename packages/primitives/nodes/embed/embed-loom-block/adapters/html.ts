import { EmbedLoomBlockSchema } from '@linvo-core/content';
import { BlockHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockHtmlAdapterMatcher } from '../../embed-shared/adapters/html';

export const embedLoomBlockHtmlAdapterMatcher =
  createEmbedBlockHtmlAdapterMatcher(EmbedLoomBlockSchema.model.flavour);

export const EmbedLoomBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  embedLoomBlockHtmlAdapterMatcher
);
