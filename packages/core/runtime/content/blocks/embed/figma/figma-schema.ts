import { BlockSchemaExtension } from '@linvo-core/store';

import { createEmbedBlockSchema } from '../../../helpers';
import {
  type EmbedFigmaBlockProps,
  EmbedFigmaModel,
  EmbedFigmaStyles,
} from './figma-model';

const defaultEmbedFigmaProps: EmbedFigmaBlockProps = {
  style: EmbedFigmaStyles[0],
  url: '',
  caption: null,

  title: null,
  description: null,
};

export const EmbedFigmaBlockSchema = createEmbedBlockSchema({
  name: 'figma',
  version: 1,
  toModel: () => new EmbedFigmaModel(),
  props: (): EmbedFigmaBlockProps => defaultEmbedFigmaProps,
});

export const EmbedFigmaBlockSchemaExtension = BlockSchemaExtension(
  EmbedFigmaBlockSchema
);
