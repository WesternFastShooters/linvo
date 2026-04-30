import { EmbedYoutubeBlockSchema } from '@linvo/linvo-model';
import { BlockMarkdownAdapterExtension } from '@linvo/linvo-shared/adapters';

import { createEmbedBlockMarkdownAdapterMatcher } from '../../common/adapters/markdown.js';

export const embedYoutubeBlockMarkdownAdapterMatcher =
  createEmbedBlockMarkdownAdapterMatcher(EmbedYoutubeBlockSchema.model.flavour);

export const EmbedYoutubeMarkdownAdapterExtension =
  BlockMarkdownAdapterExtension(embedYoutubeBlockMarkdownAdapterMatcher);
