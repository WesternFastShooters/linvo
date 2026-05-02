import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';
import { ImageBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import { literal } from 'lit/static-html.js';

import { createBuiltinToolbarConfigExtension } from './configs/toolbar';
import { EdgelessClipboardImageConfig } from './edgeless-clipboard-config';
import { ImageEdgelessBlockInteraction } from './image-edgeless-block';
import { ImageDropOption } from './image-service';
import { whiteboardEffects } from './whiteboard-effects';

const flavour = ImageBlockSchema.model.flavour;

export class ImageWhiteboardViewExtension extends ViewExtensionProvider {
  override name = 'linvo-image-block-whiteboard';

  override effect() {
    super.effect();
    whiteboardEffects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([
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
      ...createBuiltinToolbarConfigExtension(flavour),
    ]);

    if (this.isEdgeless(context.scope)) {
      context.register(EdgelessClipboardImageConfig);
    }
  }
}
