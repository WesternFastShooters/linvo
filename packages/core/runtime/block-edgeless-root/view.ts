import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo-core/composition';
import { ViewportElementExtension } from '@linvo-core/shared/services';
import {
  BlockViewExtension,
  FlavourExtension,
} from '@linvo-core/std';
import { literal } from 'lit/static-html.js';

import { ReadOnlyClipboard } from './clipboard/readonly-clipboard';
import { EdgelessClipboardController, EdgelessRootService } from './edgeless';
import { EdgelessElementToolbarExtension } from './edgeless/configs/toolbar';
import { EdgelessLocker } from './edgeless/edgeless-root-spec';
import { AltCloneExtension } from './edgeless/interact-extensions/clone-ext';
import { effects } from './effects';
import { fallbackKeymap } from './keyboard/keymap';

export class RootViewExtension extends ViewExtensionProvider {
  override name = 'linvo-root-block';

  override effect(): void {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([FlavourExtension('linvo:root'), fallbackKeymap]);
    if (this.isPreview(context.scope)) {
      context.register(ReadOnlyClipboard);
    }
    if (this.isEdgeless(context.scope)) {
      this._setupEdgeless(context);
      return;
    }
    this._setupPage(context);
  }

  private readonly _setupPage = (context: ViewExtensionContext) => {
    context.register(ViewportElementExtension('.linvo-page-viewport'));
    context.register(
      BlockViewExtension('linvo:root', literal`linvo-preview-root`)
    );
    if (!this.isPreview(context.scope)) {
      context.register(ReadOnlyClipboard);
    }
  };

  private readonly _setupEdgeless = (context: ViewExtensionContext) => {
    context.register([
      EdgelessRootService,
      ViewportElementExtension('.linvo-edgeless-viewport'),
    ]);
    if (context.scope === 'preview-edgeless') {
      context.register([
        BlockViewExtension(
          'linvo:root',
          literal`linvo-edgeless-root-preview`
        ),
        EdgelessLocker,
      ]);
      return;
    }
    context.register([
      BlockViewExtension('linvo:root', literal`linvo-edgeless-root`),
      EdgelessClipboardController,
      AltCloneExtension,
    ]);
    context.register(EdgelessElementToolbarExtension);
  };
}
