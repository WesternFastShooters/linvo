import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';
import { AttachmentBlockSchemaExtension } from '@linvo-core/content';

import { AttachmentBlockAdapterExtensions } from './adapters/extension';

export class AttachmentStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-attachment-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(AttachmentBlockSchemaExtension);
    context.register(AttachmentBlockAdapterExtensions);
  }
}
