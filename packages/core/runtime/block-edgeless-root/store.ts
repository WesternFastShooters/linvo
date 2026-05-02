import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';
import { RootBlockSchemaExtension } from '@linvo-core/content';

import { RootBlockAdapterExtensions } from './adapters/extension';

export class RootStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-root-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(RootBlockSchemaExtension);
    context.register(RootBlockAdapterExtensions);
  }
}
