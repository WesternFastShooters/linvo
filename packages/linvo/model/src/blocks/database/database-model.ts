import type { Text } from '@linvo/store';
import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@linvo/store';

import type {
  ColumnDataType,
  SerializedCells,
  ViewBasicDataType,
} from './types.js';

export type DatabaseBlockProps = {
  views: ViewBasicDataType[];
  title: Text;
  cells: SerializedCells;
  columns: Array<ColumnDataType>;
  comments?: Record<string, boolean>;
};

export class DatabaseBlockModel extends BlockModel<DatabaseBlockProps> {}

export const DatabaseBlockSchema = defineBlockSchema({
  flavour: 'linvo:database',
  props: (internal): DatabaseBlockProps => ({
    views: [],
    title: internal.Text(),
    cells: Object.create(null),
    columns: [],
    comments: undefined,
  }),
  metadata: {
    role: 'hub',
    version: 3,
    parent: ['linvo:note'],
    children: ['linvo:paragraph', 'linvo:list'],
  },
  toModel: () => new DatabaseBlockModel(),
});

export const DatabaseBlockSchemaExtension =
  BlockSchemaExtension(DatabaseBlockSchema);
