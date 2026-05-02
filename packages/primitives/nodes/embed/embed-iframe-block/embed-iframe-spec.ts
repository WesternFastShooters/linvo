import { EmbedIframeBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from './configs/toolbar';
import { EmbedIframeInteraction } from './embed-edgeless-iframe-block';

const flavour = EmbedIframeBlockSchema.model.flavour;

export const EmbedIframeViewExtensions: ExtensionType[] = [
  FlavourExtension(flavour),
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-iframe-block`
      : literal`linvo-embed-iframe-block`;
  }),
  createBuiltinToolbarConfigExtension(flavour),
  EmbedIframeInteraction,
].flat();
