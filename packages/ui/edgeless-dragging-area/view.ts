import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';

import { edgelessDraggingAreaWidget } from './edgeless-dragging-area-rect';
import { edgelessLassoDraggingAreaWidget } from './edgeless-lasso-dragging-area';
import { effects } from './effects';

export class EdgelessDraggingAreaViewExtension extends ViewExtensionProvider {
  override name = 'linvo-edgeless-dragging-area-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (this.isEdgeless(context.scope)) {
      context.register(edgelessDraggingAreaWidget);
      context.register(edgelessLassoDraggingAreaWidget);
    }
  }
}
