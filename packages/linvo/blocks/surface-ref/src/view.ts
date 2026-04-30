import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { SurfaceRefBlockSchema } from '@linvo/linvo-model';
import { ToolbarModuleExtension } from '@linvo/linvo-shared/services';
import {
  BlockFlavourIdentifier,
  BlockViewExtension,
  FlavourExtension,
} from '@linvo/std';
import { literal } from 'lit/static-html.js';

import { SurfaceRefSlashMenuConfigExtension } from './configs/slash-menu';
import { surfaceRefToolbarModuleConfig } from './configs/toolbar';
import { effects } from './effects';

const flavour = SurfaceRefBlockSchema.model.flavour;

export class SurfaceRefViewExtension extends ViewExtensionProvider {
  override name = 'linvo-surface-ref-block';

  override effect(): void {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext): void {
    super.setup(context);
    context.register([
      FlavourExtension(flavour),
      SurfaceRefSlashMenuConfigExtension,
    ]);
    const isEdgeless = this.isEdgeless(context.scope);
    if (isEdgeless) {
      context.register([
        BlockViewExtension(flavour, literal`linvo-edgeless-surface-ref`),
      ]);
    } else {
      context.register([
        BlockViewExtension(flavour, literal`linvo-surface-ref`),
        ToolbarModuleExtension({
          id: BlockFlavourIdentifier(flavour),
          config: surfaceRefToolbarModuleConfig,
        }),
      ]);
    }
  }
}
