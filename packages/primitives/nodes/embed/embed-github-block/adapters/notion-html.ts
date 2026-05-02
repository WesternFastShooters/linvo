import { EmbedGithubBlockSchema } from '@linvo-core/content';
import { BlockNotionHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockNotionHtmlAdapterMatcher } from '../../embed-shared/adapters/notion-html';
import { githubUrlRegex } from '../embed-github-model';

export const embedGithubBlockNotionHtmlAdapterMatcher =
  createEmbedBlockNotionHtmlAdapterMatcher(
    EmbedGithubBlockSchema.model.flavour,
    githubUrlRegex
  );

export const EmbedGithubBlockNotionHtmlAdapterExtension =
  BlockNotionHtmlAdapterExtension(embedGithubBlockNotionHtmlAdapterMatcher);
