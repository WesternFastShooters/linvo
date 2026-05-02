import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';

import { frameTitleWidget } from './linvo-frame-title-widget';
import { effects } from './effects';

export class FrameTitleViewExtension extends ViewExtensionProvider {
  override name = 'linvo-frame-title-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (context.scope === 'edgeless') {
      context.register(frameTitleWidget);
    }
  }
}
