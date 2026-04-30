import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo/linvo-ext-loader';

import {
  mindmapToMarkdownAdapterMatcher,
  mindmapToPlainTextAdapterMatcher,
} from './adapter';

export class MindmapStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-mindmap-gfx';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(mindmapToPlainTextAdapterMatcher);
    context.register(mindmapToMarkdownAdapterMatcher);
  }
}
