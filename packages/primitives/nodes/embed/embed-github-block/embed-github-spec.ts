import { EmbedGithubBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from '../configs/toolbar';
import { EmbedGithubBlockInteraction } from './embed-edgeless-github-block';
import { EmbedGithubBlockComponent } from './embed-github-block';
import {
  EmbedGithubBlockOptionConfig,
  EmbedGithubBlockService,
} from './embed-github-service';

const flavour = EmbedGithubBlockSchema.model.flavour;

export const EmbedGithubViewExtensions: ExtensionType[] = [
  FlavourExtension(flavour),
  EmbedGithubBlockService,
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-github-block`
      : literal`linvo-embed-github-block`;
  }),
  EmbedGithubBlockOptionConfig,
  EmbedGithubBlockInteraction,
  createBuiltinToolbarConfigExtension(flavour, EmbedGithubBlockComponent),
].flat();
