import { EmbedLoomBlockSchema } from '@linvo/linvo-model';
import { BlockHtmlAdapterExtension } from '@linvo/linvo-shared/adapters';

import { createEmbedBlockHtmlAdapterMatcher } from '../../common/adapters/html.js';

export const embedLoomBlockHtmlAdapterMatcher =
  createEmbedBlockHtmlAdapterMatcher(EmbedLoomBlockSchema.model.flavour);

export const EmbedLoomBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  embedLoomBlockHtmlAdapterMatcher
);
