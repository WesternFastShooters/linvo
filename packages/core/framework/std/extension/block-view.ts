import type { ExtensionType } from '@linvo-core/store';

import { BlockViewIdentifier } from '../identifier';
import type { BlockViewType } from '../spec/type';

/**
 * Create a block view extension.
 *
 * @param flavour The flavour of the block that the view is for.
 * @param view Lit literal template for the view. Example: `my-list-block`
 *
 * The view is a lit template that is used to render the block.
 *
 * @example
 * ```ts
 * import { BlockViewExtension } from '@linvo-core/std';
 *
 * const MyListBlockViewExtension = BlockViewExtension(
 *   'linvo:list',
 *   literal`my-list-block`
 * );
 * ```
 */
export function BlockViewExtension(
  flavour: string,
  view: BlockViewType
): ExtensionType {
  return {
    setup: di => {
      di.addImpl(BlockViewIdentifier(flavour), () => view);
    },
  };
}
