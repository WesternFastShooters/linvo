import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { BlockViewExtension } from '@linvo/std';
import { literal } from 'lit/static-html.js';

import { EdgelessClipboardEdgelessTextConfig } from './edgeless-clipboard-config';
import { EdgelessTextInteraction } from './edgeless-text-block';
import { edgelessTextToolbarExtension } from './edgeless-toolbar';
import { effects } from './effects';

export class EdgelessTextViewExtension extends ViewExtensionProvider {
  override name = 'linvo-edgeless-text-block';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    const isEdgeless = this.isEdgeless(context.scope);

    if (isEdgeless) {
      context.register([
        BlockViewExtension(
          'linvo:edgeless-text',
          literal`linvo-edgeless-text`
        ),
      ]);
      context.register(edgelessTextToolbarExtension);
      context.register(EdgelessClipboardEdgelessTextConfig);
      context.register(EdgelessTextInteraction);
    }
  }
}
