import { EdgelessFrameManagerIdentifier } from '@linvo-primitives/frame';
import { getSurfaceComponent } from '@linvo-core/block-surface';
import { createGroupFromSelectedCommand } from '@linvo-primitives/group';
import { FrameBlockModel } from '@linvo-core/content';
import type {
  ToolbarActions,
  ToolbarContext,
} from '@linvo-core/shared/services';
import { type ReorderingType } from '@linvo-core/shared/utils';
import { Bound } from '@linvo-core/global/gfx';
import {
  ArrowDownBigBottomIcon,
  ArrowDownBigIcon,
  ArrowUpBigIcon,
  ArrowUpBigTopIcon,
  CopyIcon,
  DeleteIcon,
  DuplicateIcon,
  FrameIcon,
  GroupIcon,
} from '@icons/lit';
import { GfxBlockElementModel, type GfxModel } from '@linvo-core/std/gfx';

import { EdgelessClipboardController } from '../../clipboard/clipboard';
import { duplicate } from '../../utils/clipboard-utils';
import { deleteElements } from '../../utils/crud';
import { getEdgelessWith } from './utils';

export const moreActions = [
  // Selection Group: frame & group
  {
    id: 'Z.a.selection',
    actions: [
      {
        id: 'a.create-frame',
        label: 'Frame section',
        icon: FrameIcon(),
        run(ctx) {
          const frame = ctx.std
            .get(EdgelessFrameManagerIdentifier)
            .createFrameOnSelected();
          if (!frame) return;

          const surface = getSurfaceComponent(ctx.std);
          if (!surface) return;

          surface.fitToViewport(Bound.deserialize(frame.xywh));

          ctx.track('CanvasElementAdded', {
            control: 'context-menu',
            type: 'frame',
          });
        },
      },
      {
        id: 'b.create-group',
        label: 'Group section',
        icon: GroupIcon(),
        when(ctx) {
          const models = ctx.getSurfaceModels();
          if (models.length === 0) return false;
          return !models.some(model => ctx.matchModel(model, FrameBlockModel));
        },
        run(ctx) {
          ctx.command.exec(createGroupFromSelectedCommand);
        },
      },
    ],
  },

  // Reordering Group
  {
    id: 'Z.b.reordering',
    actions: [
      {
        id: 'a.bring-to-front',
        label: 'Bring to Front',
        icon: ArrowUpBigTopIcon(),
        run(ctx) {
          const models = ctx.getSurfaceModels();
          reorderElements(ctx, models, 'front');
        },
      },
      {
        id: 'b.bring-forward',
        label: 'Bring Forward',
        icon: ArrowUpBigIcon(),
        run(ctx) {
          const models = ctx.getSurfaceModels();
          reorderElements(ctx, models, 'forward');
        },
      },
      {
        id: 'c.send-backward',
        label: 'Send Backward',
        icon: ArrowDownBigIcon(),
        run(ctx) {
          const models = ctx.getSurfaceModels();
          reorderElements(ctx, models, 'backward');
        },
      },
      {
        id: 'c.send-to-back',
        label: 'Send to Back',
        icon: ArrowDownBigBottomIcon(),
        run(ctx) {
          const models = ctx.getSurfaceModels();
          reorderElements(ctx, models, 'back');
        },
      },
    ],
  },

  // Clipboard Group
  // Uses the same `ID` for both page and edgeless modes.
  {
    id: 'a.clipboard',
    actions: [
      {
        id: 'copy',
        label: 'Copy',
        icon: CopyIcon(),
        run(ctx) {
          const models = ctx.getSurfaceModels();
          if (!models.length) return;

          const edgelessClipboard = ctx.std.getOptional(
            EdgelessClipboardController
          );
          if (!edgelessClipboard) return;

          edgelessClipboard.copy();
        },
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: DuplicateIcon(),
        run(ctx) {
          const models = ctx.getSurfaceModels();
          if (!models.length) return;

          const edgeless = getEdgelessWith(ctx);
          if (!edgeless) return;

          duplicate(edgeless, models).catch(console.error);
        },
      },
    ],
  },
  // Deleting Group
  {
    id: 'd.delete',
    label: 'Delete',
    icon: DeleteIcon(),
    variant: 'destructive',
    run(ctx) {
      const models = ctx.getSurfaceModels();
      if (!models.length) return;

      const edgeless = getEdgelessWith(ctx);
      if (!edgeless) return;

      ctx.store.captureSync();

      deleteElements(edgeless, models);

      // Clears
      ctx.select('surface');
      ctx.reset();
    },
  },
] as const satisfies ToolbarActions;

function reorderElements(
  ctx: ToolbarContext,
  models: GfxModel[],
  type: ReorderingType
) {
  if (!models.length) return;

  for (const model of models) {
    const index = ctx.gfx.layer.getReorderedIndex(model, type);

    // block should be updated in transaction
    if (model instanceof GfxBlockElementModel) {
      ctx.store.transact(() => {
        model.index = index;
      });
    } else {
      model.index = index;
    }
  }
}
