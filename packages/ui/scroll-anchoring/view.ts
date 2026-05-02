import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';

import { effects } from './effects';
import { scrollAnchoringWidget } from '.';

export class ScrollAnchoringViewExtension extends ViewExtensionProvider {
  override name = 'linvo-scroll-anchoring-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register(scrollAnchoringWidget);
  }
}
