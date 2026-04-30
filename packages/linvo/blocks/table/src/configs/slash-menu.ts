import { getSelectedModelsCommand } from '@linvo/linvo-shared/commands';
import { TelemetryProvider } from '@linvo/linvo-shared/services';
import { isInsideBlockByFlavour } from '@linvo/linvo-shared/utils';
import type { SlashMenuConfig } from '@linvo/linvo-widget-slash-menu';
import { TableIcon } from '@linvo/icons/lit';

import { insertTableBlockCommand } from '../commands';
import { tableTooltip } from './tooltips';

export const tableSlashMenuConfig: SlashMenuConfig = {
  disableWhen: ({ model }) => model.flavour === 'linvo:table',
  items: [
    {
      name: 'Table',
      description: 'Create a simple table.',
      icon: TableIcon(),
      tooltip: {
        figure: tableTooltip,
        caption: 'Table',
      },
      group: '4_Content & Media@0',
      when: ({ model }) =>
        !isInsideBlockByFlavour(model.store, model, 'linvo:edgeless-text'),
      action: ({ std }) => {
        std.command
          .chain()
          .pipe(getSelectedModelsCommand)
          .pipe(insertTableBlockCommand, {
            place: 'after',
            removeEmptyLine: true,
          })
          .pipe(({ insertedTableBlockId }) => {
            if (insertedTableBlockId) {
              const telemetry = std.getOptional(TelemetryProvider);
              telemetry?.track('BlockCreated', {
                blockType: 'linvo:table',
              });
            }
          })
          .run();
      },
    },
  ],
};
