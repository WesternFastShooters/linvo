import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';

import { toolbarWidget } from '.';
import { effects } from './effects';

export class ToolbarViewExtension extends ViewExtensionProvider {
  override name = 'linvo-toolbar-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (this.isMobile(context.scope)) return;
    context.register(toolbarWidget);
  }
}
