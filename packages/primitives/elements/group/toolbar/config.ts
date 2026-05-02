import { GroupElementModel } from '@linvo-core/content';
import {
  type ToolbarModuleConfig,
  ToolbarModuleExtension,
} from '@linvo-core/shared/services';
import { getRootBlock } from '@linvo-ui/edgeless-toolbar';
import { EditIcon, UngroupIcon } from '@icons/lit';
import { BlockFlavourIdentifier } from '@linvo-core/std';

import { ungroupCommand } from '../command';
import { mountGroupTitleEditor } from '../text/text';

export const groupToolbarConfig = {
  actions: [
    {
      id: 'b.rename',
      tooltip: 'Rename',
      icon: EditIcon(),
      when: ctx => ctx.getSurfaceModelsByType(GroupElementModel).length === 1,
      run(ctx) {
        const model = ctx.getCurrentModelByType(GroupElementModel);
        if (!model) return;

        const rootBlock = getRootBlock(ctx);
        if (!rootBlock) return;

        mountGroupTitleEditor(model, rootBlock);
      },
    },
    {
      id: 'b.ungroup',
      tooltip: 'Ungroup',
      icon: UngroupIcon(),
      run(ctx) {
        const models = ctx.getSurfaceModelsByType(GroupElementModel);
        if (!models.length) return;

        for (const model of models) {
          ctx.command.exec(ungroupCommand, { group: model });
        }
      },
    },
  ],

  when: ctx => ctx.getSurfaceModelsByType(GroupElementModel).length > 0,
} as const satisfies ToolbarModuleConfig;

export const groupToolbarExtension = ToolbarModuleExtension({
  id: BlockFlavourIdentifier('linvo:surface:group'),
  config: groupToolbarConfig,
});
