import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@linvo/store';

export const DividerBlockSchema = defineBlockSchema({
  flavour: 'linvo:divider',
  metadata: {
    version: 1,
    role: 'content',
    children: [],
  },
  toModel: () => new DividerBlockModel(),
});

type Props = {
  text: string;
};

export class DividerBlockModel extends BlockModel<Props> {}

export const DividerBlockSchemaExtension =
  BlockSchemaExtension(DividerBlockSchema);
