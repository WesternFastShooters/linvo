import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { BlockAdapterMatcher } from '../types/adapter';
import type { MarkdownDeltaConverter } from './delta-converter';
import type { MarkdownAST } from './type';

export type BlockMarkdownAdapterMatcher = BlockAdapterMatcher<
  MarkdownAST,
  MarkdownDeltaConverter
>;

export const BlockMarkdownAdapterMatcherIdentifier =
  createIdentifier<BlockMarkdownAdapterMatcher>('BlockMarkdownAdapterMatcher');

export function BlockMarkdownAdapterExtension(
  matcher: BlockMarkdownAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<BlockMarkdownAdapterMatcher>;
} {
  const identifier = BlockMarkdownAdapterMatcherIdentifier(matcher.flavour);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
