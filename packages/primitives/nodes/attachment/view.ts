import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';
import { AttachmentBlockSchema } from '@linvo-core/content';
import { BlockViewExtension, FlavourExtension } from '@linvo-core/std';
import { literal } from 'lit/static-html.js';

import { AttachmentBlockInteraction } from './attachment-edgeless-block';
import { AttachmentDropOption } from './attachment-service';
import { createBuiltinToolbarConfigExtension } from './configs/toolbar';
import { EdgelessClipboardAttachmentConfig } from './edgeless-clipboard-config';
import { effects } from './effects';
import {
  AttachmentEmbedConfigExtension,
  AttachmentEmbedService,
} from './embed';

const flavour = AttachmentBlockSchema.model.flavour;

export class AttachmentViewExtension extends ViewExtensionProvider {
  override name = 'linvo-attachment-block';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([
      FlavourExtension(flavour),
      BlockViewExtension(flavour, model => {
        return model.parent?.flavour === 'linvo:surface'
          ? literal`linvo-edgeless-attachment`
          : literal`linvo-attachment`;
      }),
      AttachmentDropOption,
      AttachmentEmbedConfigExtension(),
      AttachmentEmbedService,
      ...createBuiltinToolbarConfigExtension(flavour),
    ]);
    if (this.isEdgeless(context.scope)) {
      context.register(EdgelessClipboardAttachmentConfig);
      context.register(AttachmentBlockInteraction);
    }
  }
}
