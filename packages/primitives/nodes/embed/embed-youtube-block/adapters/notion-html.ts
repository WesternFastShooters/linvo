import { EmbedYoutubeBlockSchema } from '@linvo-core/content';
import { BlockNotionHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockNotionHtmlAdapterMatcher } from '../../embed-shared/adapters/notion-html';
import { youtubeUrlRegex } from '../embed-youtube-model';

export const embedYoutubeBlockNotionHtmlAdapterMatcher =
  createEmbedBlockNotionHtmlAdapterMatcher(
    EmbedYoutubeBlockSchema.model.flavour,
    youtubeUrlRegex
  );

export const EmbedYoutubeBlockNotionHtmlAdapterExtension =
  BlockNotionHtmlAdapterExtension(embedYoutubeBlockNotionHtmlAdapterMatcher);
