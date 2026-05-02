import { EmbedHtmlBlockSchema } from '@linvo-core/content';
import { BlockViewExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from './configs/toolbar';
import { EmbedEdgelessHtmlBlockInteraction } from './embed-edgeless-html-block';

const flavour = EmbedHtmlBlockSchema.model.flavour;

export const EmbedHtmlViewExtensions: ExtensionType[] = [
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-html-block`
      : literal`linvo-embed-html-block`;
  }),
  createBuiltinToolbarConfigExtension(flavour),
  EmbedEdgelessHtmlBlockInteraction,
].flat();
