import { EmbedFigmaBlockSchema } from '@linvo/linvo-model';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from '../configs/toolbar';
import { embedFigmaSlashMenuConfig } from './configs/slash-menu';
import { EmbedFigmaBlockInteraction } from './embed-edgeless-figma-block';
import { EmbedFigmaBlockComponent } from './embed-figma-block';
import { EmbedFigmaBlockOptionConfig } from './embed-figma-service';

const flavour = EmbedFigmaBlockSchema.model.flavour;

export const EmbedFigmaViewExtensions: ExtensionType[] = [
  FlavourExtension(flavour),
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-figma-block`
      : literal`linvo-embed-figma-block`;
  }),
  EmbedFigmaBlockOptionConfig,
  createBuiltinToolbarConfigExtension(flavour, EmbedFigmaBlockComponent),
  SlashMenuConfigExtension(flavour, embedFigmaSlashMenuConfig),
  EmbedFigmaBlockInteraction,
].flat();
