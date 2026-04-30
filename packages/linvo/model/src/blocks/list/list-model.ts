import type { Text } from '@linvo/store';
import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@linvo/store';

import type { BlockMeta } from '../../utils/types';

// `toggle` type has been deprecated, do not use it
export type ListType = 'bulleted' | 'numbered' | 'todo' | 'toggle';

export type ListProps = {
  type: ListType;
  text: Text;
  checked: boolean;
  collapsed: boolean;
  order: number | null;
  comments?: Record<string, boolean>;
} & BlockMeta;

export const ListBlockSchema = defineBlockSchema({
  flavour: 'linvo:list',
  props: internal =>
    ({
      type: 'bulleted',
      text: internal.Text(),
      checked: false,
      collapsed: false,

      // number type only for numbered list
      order: null,
      comments: undefined,
      'meta:createdAt': undefined,
      'meta:createdBy': undefined,
      'meta:updatedAt': undefined,
      'meta:updatedBy': undefined,
    }) as ListProps,
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'linvo:note',
      'linvo:database',
      'linvo:list',
      'linvo:paragraph',
      'linvo:edgeless-text',
      'linvo:callout',
    ],
  },
  toModel: () => new ListBlockModel(),
});

export const ListBlockSchemaExtension = BlockSchemaExtension(ListBlockSchema);

export class ListBlockModel extends BlockModel<ListProps> {}
