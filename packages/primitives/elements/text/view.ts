import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';

import { effects } from './effects';
import { TextElementRendererExtension } from './element-renderer';
import { TextElementView, TextInteraction } from './element-view';
import { TextTool } from './tool';
import { textToolbarExtension } from './toolbar';

export class TextViewExtension extends ViewExtensionProvider {
  override name = 'linvo-text-gfx';

  override effect(): void {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register(TextElementView);
    context.register(TextElementRendererExtension);
    if (this.isEdgeless(context.scope)) {
      context.register(TextTool);
      context.register(textToolbarExtension);
      context.register(TextInteraction);
    }
  }
}
