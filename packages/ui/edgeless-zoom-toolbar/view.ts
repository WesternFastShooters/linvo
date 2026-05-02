import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';

import { effects } from './effects';
import { edgelessZoomToolbarWidget } from '.';

export class EdgelessZoomToolbarViewExtension extends ViewExtensionProvider {
  override name = 'linvo-edgeless-zoom-toolbar-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (this.isEdgeless(context.scope)) {
      context.register(edgelessZoomToolbarWidget);
    }
  }
}
