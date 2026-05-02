import { EmbedYoutubeBlockSchema } from '@linvo-core/content';
import { BlockMarkdownAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../embed-shared/adapters/markdown';

export const embedYoutubeBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedYoutubeBlockSchema.model.flavour);

export const EmbedYoutubeMarkdownAdapterExtension =
  BlockMarkdownAdapterExtension(embedYoutubeBlockMarkdownAdapterMatcher);
