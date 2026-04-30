import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { EdgelessTextBlockSchemaExtension } from '@linvo/linvo-model';

export class EdgelessTextStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-edgeless-text-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(EdgelessTextBlockSchemaExtension);
  }
}
