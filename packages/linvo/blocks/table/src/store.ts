import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { TableBlockSchemaExtension } from '@linvo/linvo-model';

import { TableBlockAdapterExtensions } from './adapters/extension';
import { TableSelectionExtension } from './selection-schema';

export class TableStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-table-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(TableBlockSchemaExtension);
    context.register(TableBlockAdapterExtensions);
    context.register(TableSelectionExtension);
  }
}
