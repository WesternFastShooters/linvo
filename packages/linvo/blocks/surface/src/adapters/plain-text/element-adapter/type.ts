import type { TextBuffer } from '@linvo/linvo-shared/adapters';
import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';

import type { ElementModelMatcher } from '../../type.js';

export type ElementToPlainTextAdapterMatcher = ElementModelMatcher<TextBuffer>;

export const ElementToPlainTextAdapterMatcherIdentifier =
  createIdentifier<ElementToPlainTextAdapterMatcher>(
    'elementToPlainTextAdapterMatcher'
  );

export function ElementToPlainTextAdapterExtension(
  matcher: ElementToPlainTextAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<ElementToPlainTextAdapterMatcher>;
} {
  const identifier = ElementToPlainTextAdapterMatcherIdentifier(matcher.name);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
