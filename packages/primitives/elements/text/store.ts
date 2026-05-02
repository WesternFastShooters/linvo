import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';

import {
  textToMarkdownAdapterMatcher,
  textToPlainTextAdapterMatcher,
} from './adapter';

export class TextStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-text-gfx';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(textToMarkdownAdapterMatcher);
    context.register(textToPlainTextAdapterMatcher);
  }
}
