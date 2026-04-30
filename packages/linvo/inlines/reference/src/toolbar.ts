import { ToolbarModuleExtension } from '@linvo/linvo-shared/services';
import { BlockFlavourIdentifier } from '@linvo/std';

import { builtinInlineReferenceToolbarConfig } from './reference-node/configs/toolbar';

export const referenceNodeToolbar = ToolbarModuleExtension({
  id: BlockFlavourIdentifier('linvo:reference'),
  config: builtinInlineReferenceToolbarConfig,
});
