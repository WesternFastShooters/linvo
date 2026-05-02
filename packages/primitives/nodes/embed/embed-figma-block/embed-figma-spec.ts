import { EmbedFigmaBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from '../configs/toolbar';
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
  EmbedFigmaBlockInteraction,
].flat();
