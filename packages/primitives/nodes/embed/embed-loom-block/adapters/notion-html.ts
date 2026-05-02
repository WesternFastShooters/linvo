import { EmbedLoomBlockSchema } from '@linvo-core/content';
import { BlockNotionHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockNotionHtmlAdapterMatcher } from '../../embed-shared/adapters/notion-html';
import { loomUrlRegex } from '../embed-loom-model';

export const embedLoomBlockNotionHtmlAdapterMatcher =
  createEmbedBlockNotionHtmlAdapterMatcher(
    EmbedLoomBlockSchema.model.flavour,
    loomUrlRegex
  );

export const EmbedLoomBlockNotionHtmlAdapterExtension =
  BlockNotionHtmlAdapterExtension(embedLoomBlockNotionHtmlAdapterMatcher);
