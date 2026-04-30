import { DefaultTool } from '@linvo/linvo-block-surface';
import { toggleEmbedCardCreateModal } from '@linvo/linvo-components/embed-card-modal';
import type { SlashMenuConfig } from '@linvo/linvo-widget-slash-menu';
import { FigmaDuotoneIcon } from '@linvo/icons/lit';
import { GfxControllerIdentifier } from '@linvo/std/gfx';

import { FigmaTooltip } from './tooltips';

export const embedFigmaSlashMenuConfig: SlashMenuConfig = {
  items: [
    {
      name: 'Figma',
      description: 'Embed a Figma document.',
      icon: FigmaDuotoneIcon(),
      tooltip: {
        figure: FigmaTooltip,
        caption: 'Figma',
      },
      group: '4_Content & Media@8',
      when: ({ model }) =>
        model.store.schema.flavourSchemaMap.has('linvo:embed-figma'),
      action: ({ std, model }) => {
        (async () => {
          const { host } = std;
          const parentModel = host.store.getParent(model);
          if (!parentModel) {
            return;
          }
          const index = parentModel.children.indexOf(model) + 1;
          await toggleEmbedCardCreateModal(
            host,
            'Figma',
            'The added Figma link will be displayed as an embed view.',
            { mode: 'page', parentModel, index },
            ({ mode }) => {
              if (mode === 'edgeless') {
                const gfx = std.get(GfxControllerIdentifier);
                gfx.tool.setTool(DefaultTool);
              }
            }
          );
          if (model.text?.length === 0) std.store.deleteBlock(model);
        })().catch(console.error);
      },
    },
  ],
};
