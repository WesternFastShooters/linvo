import { EmbedFigmaBlockSchema } from '@linvo-core/content';
import { BlockNotionHtmlAdapterExtension } from '@linvo-core/shared/adapters';

import { createEmbedBlockNotionHtmlAdapterMatcher } from '../../embed-shared/adapters/notion-html';
import { figmaUrlRegex } from '../embed-figma-model';

export const embedFigmaBlockNotionHtmlAdapterMatcher =
  createEmbedBlockNotionHtmlAdapterMatcher(
    EmbedFigmaBlockSchema.model.flavour,
    figmaUrlRegex
  );

export const EmbedFigmaBlockNotionHtmlAdapterExtension =
  BlockNotionHtmlAdapterExtension(embedFigmaBlockNotionHtmlAdapterMatcher);
