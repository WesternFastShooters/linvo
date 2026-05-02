import { ImageBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from './configs/toolbar';
import { ImageEdgelessBlockInteraction } from './image-edgeless-block';
import { ImageDropOption } from './image-service';

const flavour = ImageBlockSchema.model.flavour;

export const ImageBlockSpec: ExtensionType[] = [
  FlavourExtension(flavour),
  BlockViewExtension(flavour, model => {
    const parent = model.store.getParent(model.id);

    if (parent?.flavour === 'linvo:surface') {
      return literal`linvo-edgeless-image`;
    }

    return literal`linvo-image`;
  }),
  ImageDropOption,
  ImageEdgelessBlockInteraction,
  createBuiltinToolbarConfigExtension(flavour),
].flat();
