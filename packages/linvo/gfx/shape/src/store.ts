import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';

import {
  shapeToMarkdownAdapterMatcher,
  shapeToPlainTextAdapterMatcher,
} from './adapter';

export class ShapeStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-shape-gfx';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(shapeToMarkdownAdapterMatcher);
    context.register(shapeToPlainTextAdapterMatcher);
  }
}
