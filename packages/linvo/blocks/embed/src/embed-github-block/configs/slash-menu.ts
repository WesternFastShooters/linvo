import { DefaultTool } from '@linvo/linvo-block-surface';
import { toggleEmbedCardCreateModal } from '@linvo/linvo-components/embed-card-modal';
import type { SlashMenuConfig } from '@linvo/linvo-widget-slash-menu';
import { GithubDuotoneIcon } from '@linvo/icons/lit';
import { GfxControllerIdentifier } from '@linvo/std/gfx';

import { GithubRepoTooltip } from './tooltips';

export const embedGithubSlashMenuConfig: SlashMenuConfig = {
  items: [
    {
      name: 'GitHub',
      description: 'Link to a GitHub repository.',
      icon: GithubDuotoneIcon(),
      tooltip: {
        figure: GithubRepoTooltip,
        caption: 'GitHub Repo',
      },
      group: '4_Content & Media@7',
      when: ({ model }) =>
        model.store.schema.flavourSchemaMap.has('linvo:embed-github'),
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
            'GitHub',
            'The added GitHub issue or pull request link will be displayed as a card view.',
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
