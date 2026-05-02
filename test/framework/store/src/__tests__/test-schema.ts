import { BlockSchemaExtension } from '@linvo-core/store';
import { BlockModel, defineBlockSchema } from '@linvo-core/store';

export const RootBlockSchema = defineBlockSchema({
  flavour: 'linvo:root',
  props: internal => ({
    title: internal.Text(),
    count: 0,
    style: {} as Record<string, unknown>,
    items: [] as unknown[],
  }),
  metadata: {
    version: 2,
    role: 'root',
  },
});

export const RootBlockSchemaExtension = BlockSchemaExtension(RootBlockSchema);

export class RootBlockModel extends BlockModel<
  ReturnType<(typeof RootBlockSchema)['model']['props']>
> {}

export const NoteBlockSchema = defineBlockSchema({
  flavour: 'linvo:note',
  props: () => ({}),
  metadata: {
    version: 1,
    role: 'hub',
    parent: ['linvo:root'],
    children: ['linvo:item', 'linvo:group', 'linvo:note-block-*'],
  },
});

export const NoteBlockSchemaExtension = BlockSchemaExtension(NoteBlockSchema);

export const ItemBlockSchema = defineBlockSchema({
  flavour: 'linvo:item',
  props: internal => ({
    type: 'text',
    text: internal.Text(),
  }),
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'linvo:note',
      'linvo:group',
      'linvo:item',
    ],
  },
});

export const ItemBlockSchemaExtension = BlockSchemaExtension(ItemBlockSchema);

export const GroupBlockSchema = defineBlockSchema({
  flavour: 'linvo:group',
  props: internal => ({
    type: 'bulleted',
    text: internal.Text(),
    checked: false,
    collapsed: false,
  }),
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'linvo:note',
      'linvo:group',
      'linvo:item',
    ],
  },
});

export const GroupBlockSchemaExtension = BlockSchemaExtension(GroupBlockSchema);
