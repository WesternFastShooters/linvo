import type { TextBuffer } from '@linvo-core/shared/adapters';
import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { ElementModelMatcher } from '../../type';

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
