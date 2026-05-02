import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { BlockAdapterMatcher, TextBuffer } from '../types/adapter';

export type BlockPlainTextAdapterMatcher = BlockAdapterMatcher<TextBuffer>;

export const BlockPlainTextAdapterMatcherIdentifier =
  createIdentifier<BlockPlainTextAdapterMatcher>(
    'BlockPlainTextAdapterMatcher'
  );

export function BlockPlainTextAdapterExtension(
  matcher: BlockPlainTextAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<BlockPlainTextAdapterMatcher>;
} {
  const identifier = BlockPlainTextAdapterMatcherIdentifier(matcher.flavour);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
