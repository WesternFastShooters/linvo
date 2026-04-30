import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';

import { effects } from './effects';
import { pageDraggingAreaWidget } from './index';

export class PageDraggingAreaViewExtension extends ViewExtensionProvider {
  override name = 'linvo-page-dragging-area-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (this.isEdgeless(context.scope)) {
      return;
    }
    context.register(pageDraggingAreaWidget);
  }
}
