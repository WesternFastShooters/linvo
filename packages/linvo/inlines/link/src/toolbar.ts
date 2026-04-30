import { ToolbarModuleExtension } from '@linvo/linvo-shared/services';
import { BlockFlavourIdentifier } from '@linvo/std';

import { builtinInlineLinkToolbarConfig } from './link-node/configs/toolbar.js';

export const linkToolbar = ToolbarModuleExtension({
  id: BlockFlavourIdentifier('linvo:link'),
  config: builtinInlineLinkToolbarConfig,
});
