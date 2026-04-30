import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { SurfaceRefBlockSchemaExtension } from '@linvo/linvo-model';

export class SurfaceRefStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-surface-ref-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(SurfaceRefBlockSchemaExtension);
  }
}
