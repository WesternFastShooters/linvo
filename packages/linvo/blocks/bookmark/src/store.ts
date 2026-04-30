import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { BookmarkBlockSchemaExtension } from '@linvo/linvo-model';

import { BookmarkBlockAdapterExtensions } from './adapters/extension';

export class BookmarkStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-bookmark-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(BookmarkBlockSchemaExtension);
    context.register(BookmarkBlockAdapterExtensions);
  }
}
