import { ViewExtensionProvider } from '@linvo/linvo-ext-loader';

import { effects } from './effects';

export class AdapterPanelViewExtension extends ViewExtensionProvider {
  override name = 'linvo-adapter-panel-fragment';

  override effect() {
    super.effect();
    effects();
  }
}
