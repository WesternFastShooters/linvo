import type { MarkdownAST } from '@linvo-core/shared/adapters';

import {
  ElementModelAdapter,
  type ElementModelAdapterContext,
} from '../../type';
import type { ElementToMarkdownAdapterMatcher } from './type';

export class MarkdownElementModelAdapter extends ElementModelAdapter<
  MarkdownAST,
  MarkdownAST
> {
  constructor(
    readonly elementModelMatchers: ElementToMarkdownAdapterMatcher[]
  ) {
    super();
  }

  fromElementModel(
    element: Record<string, unknown>,
    context: ElementModelAdapterContext<MarkdownAST>
  ) {
    const markdownAST: MarkdownAST | null = null;
    for (const matcher of this.elementModelMatchers) {
      if (matcher.match(element)) {
        return matcher.toAST(element, context);
      }
    }
    return markdownAST;
  }
}

export * from './type';
