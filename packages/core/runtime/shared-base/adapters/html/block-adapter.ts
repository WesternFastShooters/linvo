import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { BlockAdapterMatcher } from '../types/adapter';
import type { HtmlAST } from '../types/hast';
import type { HtmlDeltaConverter } from './delta-converter';

export type BlockHtmlAdapterMatcher = BlockAdapterMatcher<
  HtmlAST,
  HtmlDeltaConverter
>;

export const BlockHtmlAdapterMatcherIdentifier =
  createIdentifier<BlockHtmlAdapterMatcher>('BlockHtmlAdapterMatcher');

export function BlockHtmlAdapterExtension(
  matcher: BlockHtmlAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<BlockHtmlAdapterMatcher>;
} {
  const identifier = BlockHtmlAdapterMatcherIdentifier(matcher.flavour);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
