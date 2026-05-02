import { EmbedGithubBlockSchema } from '@linvo-core/content';
import { BlockPlainTextAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockPlainTextAdapterMatcher } from '../../embed-shared/adapters/plain-text';

export const embedGithubBlockPlainTextAdapterMatcher =
  createEmbedBlockPlainTextAdapterMatcher(EmbedGithubBlockSchema.model.flavour);

export const EmbedGithubBlockPlainTextAdapterExtension =
  BlockPlainTextAdapterExtension(embedGithubBlockPlainTextAdapterMatcher);
