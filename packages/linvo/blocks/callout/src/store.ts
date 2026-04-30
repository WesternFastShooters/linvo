import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { CalloutBlockSchemaExtension } from '@linvo/linvo-model';

import { CalloutBlockMarkdownAdapterExtension } from './adapters/markdown';

export class CalloutStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-callout-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(CalloutBlockSchemaExtension);
    context.register(CalloutBlockMarkdownAdapterExtension);
  }
}
