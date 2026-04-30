import { createTextActions } from '@linvo/linvo-gfx-text';
import { EdgelessTextBlockModel } from '@linvo/linvo-model';
import {
  type ToolbarModuleConfig,
  ToolbarModuleExtension,
} from '@linvo/linvo-shared/services';
import { BlockFlavourIdentifier } from '@linvo/std';

export const edgelessTextToolbarConfig = {
  // No need to adjust element bounds, which updates itself using ResizeObserver
  actions: createTextActions(EdgelessTextBlockModel, 'edgeless-text'),

  when: ctx => ctx.getSurfaceModelsByType(EdgelessTextBlockModel).length > 0,
} as const satisfies ToolbarModuleConfig;

export const edgelessTextToolbarExtension = ToolbarModuleExtension({
  id: BlockFlavourIdentifier('linvo:surface:edgeless-text'),
  config: edgelessTextToolbarConfig,
});
