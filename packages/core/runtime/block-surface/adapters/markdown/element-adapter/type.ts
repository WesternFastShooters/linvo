import type { ExtensionType } from '@linvo-core/store';
import type { MarkdownAST } from '@linvo-core/shared/adapters';
import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';

import type { ElementModelMatcher } from '../../type';

export type ElementToMarkdownAdapterMatcher = ElementModelMatcher<MarkdownAST>;

export const ElementToMarkdownAdapterMatcherIdentifier =
  createIdentifier<ElementToMarkdownAdapterMatcher>(
    'elementToMarkdownAdapterMatcher'
  );

export function ElementToMarkdownAdapterExtension(
  matcher: ElementToMarkdownAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<ElementToMarkdownAdapterMatcher>;
} {
  const identifier = ElementToMarkdownAdapterMatcherIdentifier(matcher.name);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
