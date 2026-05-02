import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';

import { effects } from './effects';
import { viewportOverlayWidget } from '.';

export class ViewportOverlayViewExtension extends ViewExtensionProvider {
  override name = 'linvo-viewport-overlay-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register(viewportOverlayWidget);
  }
}
