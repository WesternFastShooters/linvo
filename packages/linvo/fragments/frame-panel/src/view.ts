import { ViewExtensionProvider } from '@linvo/linvo-ext-loader';

import { effects } from './effects';

export class FramePanelViewExtension extends ViewExtensionProvider {
  override name = 'linvo-frame-panel-fragment';

  override effect() {
    super.effect();
    effects();
  }
}
