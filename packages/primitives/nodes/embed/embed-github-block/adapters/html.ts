import { EmbedGithubBlockSchema } from '@linvo-core/content';
import { BlockHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockHtmlAdapterMatcher } from '../../embed-shared/adapters/html';

export const embedGithubBlockHtmlAdapterMatcher =
  createEmbedBlockHtmlAdapterMatcher(EmbedGithubBlockSchema.model.flavour);

export const EmbedGithubBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  embedGithubBlockHtmlAdapterMatcher
);
