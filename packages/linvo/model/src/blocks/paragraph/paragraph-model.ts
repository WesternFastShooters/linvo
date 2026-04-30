import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
  type Text,
} from '@linvo/store';

import type { BlockMeta } from '../../utils/types';

export type ParagraphType =
  | 'text'
  | 'quote'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

export type ParagraphProps = {
  type: ParagraphType;
  text: Text;
  collapsed: boolean;
  comments?: Record<string, boolean>;
} & BlockMeta;

export const ParagraphBlockSchema = defineBlockSchema({
  flavour: 'linvo:paragraph',
  props: (internal): ParagraphProps => ({
    type: 'text',
    text: internal.Text(),
    collapsed: false,
    comments: undefined,
    'meta:createdAt': undefined,
    'meta:createdBy': undefined,
    'meta:updatedAt': undefined,
    'meta:updatedBy': undefined,
  }),
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'linvo:note',
      'linvo:database',
      'linvo:paragraph',
      'linvo:list',
      'linvo:edgeless-text',
      'linvo:callout',
      'linvo:transcription',
    ],
  },
  toModel: () => new ParagraphBlockModel(),
});

export const ParagraphBlockSchemaExtension =
  BlockSchemaExtension(ParagraphBlockSchema);

export class ParagraphBlockModel extends BlockModel<ParagraphProps> {
  override isEmpty(): boolean {
    return this.props.text$.value.length === 0 && this.children.length === 0;
  }
}
