import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { FrameBlockSchemaExtension } from '@linvo/linvo-model';

export class FrameStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-frame-block';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register([FrameBlockSchemaExtension]);
  }
}
