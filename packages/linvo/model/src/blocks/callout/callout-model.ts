import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
  type Text,
} from '@linvo/store';

import type { BlockMeta } from '../../utils/types';

export type CalloutProps = {
  emoji: string;
  text: Text;
} & BlockMeta;

export const CalloutBlockSchema = defineBlockSchema({
  flavour: 'linvo:callout',
  props: (internal): CalloutProps => ({
    emoji: '😀',
    text: internal.Text(),
    'meta:createdAt': undefined,
    'meta:updatedAt': undefined,
    'meta:createdBy': undefined,
    'meta:updatedBy': undefined,
  }),
  metadata: {
    version: 1,
    role: 'hub',
    parent: [
      'linvo:note',
      'linvo:database',
      'linvo:paragraph',
      'linvo:list',
      'linvo:edgeless-text',
      'linvo:transcription',
    ],
    children: ['linvo:paragraph', 'linvo:list'],
  },
  toModel: () => new CalloutBlockModel(),
});

export class CalloutBlockModel extends BlockModel<CalloutProps> {}

export const CalloutBlockSchemaExtension =
  BlockSchemaExtension(CalloutBlockSchema);
