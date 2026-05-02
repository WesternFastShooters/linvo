import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type { BaseTextAttributes, ExtensionType } from '@linvo-core/store';

import type { InlineMarkdownMatch } from './type';

export const MarkdownMatcherIdentifier = createIdentifier<unknown>(
  'LinvoMarkdownMatcher'
);

export function InlineMarkdownExtension<
  TextAttributes extends BaseTextAttributes,
>(
  matcher: InlineMarkdownMatch<TextAttributes>
): ExtensionType & {
  identifier: ServiceIdentifier<InlineMarkdownMatch<TextAttributes>>;
} {
  const identifier = MarkdownMatcherIdentifier<
    InlineMarkdownMatch<TextAttributes>
  >(matcher.name);

  return {
    setup: di => {
      di.addImpl(identifier, () => ({ ...matcher }));
    },
    identifier,
  };
}
