import { ViewExtensionProvider } from '@linvo/linvo-ext-loader';

import { effects } from './effects';

export class DocTitleViewExtension extends ViewExtensionProvider {
  override name = 'linvo-doc-title-fragment';

  override effect() {
    super.effect();
    effects();
  }
}
