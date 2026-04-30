import { EmbedLinkedDocBlockSchema } from '@linvo/linvo-model';
import { BlockViewExtension } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { literal } from 'lit/static-html.js';

import { LinkedDocSlashMenuConfigExtension } from './configs/slash-menu';
import { createBuiltinToolbarConfigExtension } from './configs/toolbar';
import { EmbedLinkedDocInteraction } from './embed-edgeless-linked-doc-block';

const flavour = EmbedLinkedDocBlockSchema.model.flavour;

export const EmbedLinkedDocViewExtensions: ExtensionType[] = [
  BlockViewExtension(flavour, model => {
    return model.parent?.flavour === 'linvo:surface'
      ? literal`linvo-embed-edgeless-linked-doc-block`
      : literal`linvo-embed-linked-doc-block`;
  }),
  createBuiltinToolbarConfigExtension(flavour),
  EmbedLinkedDocInteraction,
  LinkedDocSlashMenuConfigExtension,
].flat();
