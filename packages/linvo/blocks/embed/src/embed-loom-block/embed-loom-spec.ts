import { EmbedLoomBlockSchema } from '@linvo/linvo-model';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from '../configs/toolbar';
import { embedLoomSlashMenuConfig } from './configs/slash-menu';
import { EmbedLoomBlockInteraction } from './embed-edgeless-loom-bock';
import { EmbedLoomBlockComponent } from './embed-loom-block';
import {
  EmbedLoomBlockOptionConfig,
  EmbedLoomBlockService,
} from './embed-loom-service';

const flavour = EmbedLoomBlockSchema.model.flavour;

export const EmbedLoomViewExtensions: ExtensionType[] = [
  FlavourExtension(flavour),
  EmbedLoomBlockService,
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-loom-block`
      : literal`linvo-embed-loom-block`;
  }),
  EmbedLoomBlockOptionConfig,
  createBuiltinToolbarConfigExtension(flavour, EmbedLoomBlockComponent),
  SlashMenuConfigExtension(flavour, embedLoomSlashMenuConfig),
  EmbedLoomBlockInteraction,
].flat();
