import { EdgelessCRUDIdentifier } from '@linvo-core/block-surface';
import {
  packColor,
  type PickColorEvent,
} from '@linvo-ui/components/color-picker';
import {
  DefaultTheme,
  FrameBlockModel,
  FrameBlockSchema,
  resolveColor,
} from '@linvo-core/content';
import {
  type ToolbarContext,
  type ToolbarModuleConfig,
  ToolbarModuleExtension,
} from '@linvo-core/shared/services';
import { getMostCommonResolvedValue } from '@linvo-core/shared/utils';
import { mountFrameTitleEditor } from '@linvo-ui/frame-title';
import { EditIcon, UngroupIcon } from '@icons/lit';
import { type BlockComponent, BlockFlavourIdentifier } from '@linvo-core/std';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
import type { ExtensionType } from '@linvo-core/store';
import { html } from 'lit';

import { EdgelessFrameManagerIdentifier } from './frame-manager';

function getRootBlock(ctx: ToolbarContext): BlockComponent | null {
  const rootModel = ctx.store.root;
  if (!rootModel) return null;

  return ctx.view.getBlock(rootModel.id);
}

const builtinSurfaceToolbarConfig = {
  actions: [
    {
      id: 'b.rename',
      tooltip: 'Rename',
      icon: EditIcon(),
      when: ctx => ctx.getSurfaceModelsByType(FrameBlockModel).length === 1,
      run(ctx) {
        const model = ctx.getCurrentModelByType(FrameBlockModel);
        if (!model) return;

        const rootBlock = getRootBlock(ctx);
        if (!rootBlock) return;

        mountFrameTitleEditor(model, rootBlock);
      },
    },
    {
      id: 'b.ungroup',
      tooltip: 'Ungroup',
      icon: UngroupIcon(),
      run(ctx) {
        const models = ctx.getSurfaceModelsByType(FrameBlockModel);
        if (!models.length) return;

        const crud = ctx.std.get(EdgelessCRUDIdentifier);
        const gfx = ctx.std.get(GfxControllerIdentifier);

        ctx.store.captureSync();

        const frameManager = ctx.std.get(EdgelessFrameManagerIdentifier);

        for (const model of models) {
          frameManager.removeAllChildrenFromFrame(model);
        }

        for (const model of models) {
          crud.removeElement(model.id);
        }

        gfx.selection.clear();
      },
    },
    {
      id: 'c.color-picker',
      content(ctx) {
        const models = ctx.getSurfaceModelsByType(FrameBlockModel);
        if (!models.length) return null;

        const enableCustomColor = ctx.features.getFlag('enable_color_picker');
        const theme = ctx.theme.edgeless$.value;

        const field = 'background';
        const firstModel = models[0];
        const background =
          getMostCommonResolvedValue(
            models.map(model => model.props),
            field,
            background => resolveColor(background, theme)
          ) ?? DefaultTheme.transparent;
        const onPick = (e: PickColorEvent) => {
          switch (e.type) {
            case 'pick':
              {
                const color = e.detail.value;
                const props = packColor(field, color);
                const crud = ctx.std.get(EdgelessCRUDIdentifier);
                models.forEach(model => {
                  crud.updateElement(model.id, props);
                });
              }
              break;
            case 'start':
              ctx.store.captureSync();
              models.forEach(model => {
                model.stash(field);
              });
              break;
            case 'end':
              ctx.store.transact(() => {
                models.forEach(model => {
                  model.pop(field);
                });
              });
              break;
          }
        };

        return html`
          <edgeless-color-picker-button
            class="background"
            .label="${'Background'}"
            .pick=${onPick}
            .color=${background}
            .theme=${theme}
            .originalColor=${firstModel.props.background}
            .enableCustomColor=${enableCustomColor}
          >
          </edgeless-color-picker-button>
        `;
      },
    },
  ],

  when: ctx => ctx.getSurfaceModelsByType(FrameBlockModel).length > 0,
} as const satisfies ToolbarModuleConfig;

const createFrameToolbarConfig = (flavour: string): ExtensionType => {
  const name = flavour.split(':').pop();

  return ToolbarModuleExtension({
    id: BlockFlavourIdentifier(`linvo:surface:${name}`),
    config: builtinSurfaceToolbarConfig,
  });
};

export const frameToolbarExtension = createFrameToolbarConfig(
  FrameBlockSchema.model.flavour
);
