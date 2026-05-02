import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';
import { FrameBlockSchemaExtension } from '@linvo-core/content';

export class FrameStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-frame-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register([FrameBlockSchemaExtension]);
  }
}
