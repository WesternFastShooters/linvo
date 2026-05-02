import { EmbedYoutubeBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from '../configs/toolbar';
import { EmbedYoutubeBlockInteraction } from './embed-edgeless-youtube-block';
import { EmbedYoutubeBlockComponent } from './embed-youtube-block';
import {
  EmbedYoutubeBlockOptionConfig,
  EmbedYoutubeBlockService,
} from './embed-youtube-service';

const flavour = EmbedYoutubeBlockSchema.model.flavour;

export const EmbedYoutubeViewExtensions: ExtensionType[] = [
  FlavourExtension(flavour),
  EmbedYoutubeBlockService,
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-youtube-block`
      : literal`linvo-embed-youtube-block`;
  }),
  EmbedYoutubeBlockOptionConfig,
  createBuiltinToolbarConfigExtension(flavour, EmbedYoutubeBlockComponent),
  EmbedYoutubeBlockInteraction,
].flat();
