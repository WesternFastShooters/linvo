import { BlockSchemaExtension } from '@linvo-core/store';

import { createEmbedBlockSchema } from '../../../helpers';
import {
  type EmbedLoomBlockProps,
  EmbedLoomModel,
  EmbedLoomStyles,
} from './loom-model';

const defaultEmbedLoomProps: EmbedLoomBlockProps = {
  style: EmbedLoomStyles[0],
  url: '',
  caption: null,

  image: null,
  title: null,
  description: null,
  videoId: null,
};

export const EmbedLoomBlockSchema = createEmbedBlockSchema({
  name: 'loom',
  version: 1,
  toModel: () => new EmbedLoomModel(),
  props: (): EmbedLoomBlockProps => defaultEmbedLoomProps,
});

export const EmbedLoomBlockSchemaExtension =
  BlockSchemaExtension(EmbedLoomBlockSchema);
