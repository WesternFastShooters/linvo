import { ToolbarModuleExtension } from '@linvo/linvo-shared/services';
import { BlockFlavourIdentifier } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';

import { builtinLockedToolbarConfig, builtinMiscToolbarConfig } from './misc';

export const EdgelessElementToolbarExtension: ExtensionType[] = [
  ToolbarModuleExtension({
    id: BlockFlavourIdentifier('linvo:surface:*'),
    config: builtinMiscToolbarConfig,
  }),

  // Special Scenarios
  // Only display the `unlock` button when the selection includes a locked element.
  ToolbarModuleExtension({
    id: BlockFlavourIdentifier('linvo:surface:locked'),
    config: builtinLockedToolbarConfig,
  }),
];
