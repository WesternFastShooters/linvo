import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';
import { ImageBlockSchemaExtension } from '@linvo-core/content';
import { ImageSelectionExtension } from '@linvo-core/shared/selection';

import { ImageBlockAdapterExtensions } from './adapters/extension';

export class ImageStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-image-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register([ImageBlockSchemaExtension, ImageSelectionExtension]);
    context.register(ImageBlockAdapterExtensions);
  }
}
