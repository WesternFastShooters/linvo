import { EmbedGithubBlockSchema } from '@linvo/linvo-model';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from '../configs/toolbar';
import { embedGithubSlashMenuConfig } from './configs/slash-menu';
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
  SlashMenuConfigExtension(flavour, embedGithubSlashMenuConfig),
].flat();
