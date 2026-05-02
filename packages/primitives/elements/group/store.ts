import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';

import {
  groupToMarkdownAdapterMatcher,
  groupToPlainTextAdapterMatcher,
} from './adapter';
import { groupRelationWatcherExtension } from './group-watcher';

export class GroupStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-group-gfx';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(groupToPlainTextAdapterMatcher);
    context.register(groupToMarkdownAdapterMatcher);
    context.register(groupRelationWatcherExtension);
  }
}
