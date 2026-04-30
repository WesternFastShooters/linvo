import { ViewExtensionProvider } from '@linvo/linvo-ext-loader';

import { effects } from './effects';

export class OutlineViewExtension extends ViewExtensionProvider {
  override name = 'linvo-outline-fragment';

  override effect() {
    super.effect();
    effects();
  }
}
