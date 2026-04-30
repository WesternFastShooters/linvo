import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';

import { DataViewBlockSchemaExtension } from './data-view-model';

export class DataViewStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-data-view-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(DataViewBlockSchemaExtension);
  }
}
