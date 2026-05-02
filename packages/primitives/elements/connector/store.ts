import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';

import {
  connectorToMarkdownAdapterMatcher,
  connectorToPlainTextAdapterMatcher,
} from './adapter';
import { connectorWatcherExtension } from './connector-watcher';

export class ConnectorStoreExtension extends StoreExtensionProvider {
  override name = 'linvo-connector-gfx';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register(connectorToPlainTextAdapterMatcher);
    context.register(connectorToMarkdownAdapterMatcher);
    context.register(connectorWatcherExtension);
  }
}
