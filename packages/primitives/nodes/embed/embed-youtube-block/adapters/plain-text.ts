import { EmbedYoutubeBlockSchema } from '@linvo-core/content';
import { BlockPlainTextAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockPlainTextAdapterMatcher } from '../../embed-shared/adapters/plain-text';

export const embedYoutubeBlockPlainTextAdapterMatcher =
  createEmbedBlockPlainTextAdapterMatcher(
    EmbedYoutubeBlockSchema.model.flavour
  );

export const EmbedYoutubeBlockPlainTextAdapterExtension =
  BlockPlainTextAdapterExtension(embedYoutubeBlockPlainTextAdapterMatcher);
