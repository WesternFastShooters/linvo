import { toast } from '@linvo-ui/components/toast';
import {
  copySelectedModelsCommand,
  draftSelectedModelsCommand,
  duplicateSelectedModelsCommand,
  getSelectedModelsCommand,
} from '@linvo-core/shared/commands';
import {
  ActionPlacement,
  blockCommentToolbarButton,
  type ToolbarModuleConfig,
} from '@linvo-core/shared/services';
import { CopyIcon, DuplicateIcon } from '@icons/lit';

export const builtinToolbarConfig = {
  actions: [
    {
      id: 'g.comment',
      ...blockCommentToolbarButton,
    },
    {
      placement: ActionPlacement.More,
      id: 'a.clipboard',
      actions: [
        {
          id: 'copy',
          label: 'Copy',
          icon: CopyIcon(),
          run({ chain, host }) {
            const [ok] = chain
              .pipe(getSelectedModelsCommand)
              .pipe(draftSelectedModelsCommand)
              .pipe(copySelectedModelsCommand)
              .run();

            if (!ok) return;

            toast(host, 'Copied to clipboard');
          },
        },
        {
          id: 'duplicate',
          label: 'Duplicate',
          icon: DuplicateIcon(),
          run({ chain, store }) {
            store.captureSync();

            chain
              .pipe(getSelectedModelsCommand, {
                types: ['block', 'image'],
                mode: 'highest',
              })
              .pipe(duplicateSelectedModelsCommand)
              .run();
          },
        },
      ],
    },
  ],
} satisfies ToolbarModuleConfig;
