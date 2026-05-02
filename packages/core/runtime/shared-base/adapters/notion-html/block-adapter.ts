import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { BlockAdapterMatcher } from '../types/adapter';
import type { HtmlAST } from '../types/hast';
import type { NotionHtmlDeltaConverter } from './delta-converter';

export type BlockNotionHtmlAdapterMatcher = BlockAdapterMatcher<
  HtmlAST,
  NotionHtmlDeltaConverter
>;

export const BlockNotionHtmlAdapterMatcherIdentifier =
  createIdentifier<BlockNotionHtmlAdapterMatcher>(
    'BlockNotionHtmlAdapterMatcher'
  );

export function BlockNotionHtmlAdapterExtension(
  matcher: BlockNotionHtmlAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<BlockNotionHtmlAdapterMatcher>;
} {
  const identifier = BlockNotionHtmlAdapterMatcherIdentifier(matcher.flavour);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
