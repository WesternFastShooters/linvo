import { BlockSchemaExtension, defineBlockSchema } from '@linvo-core/store';

import { defaultEmbedIframeProps, EmbedIframeBlockModel } from './iframe-model';

export const EmbedIframeBlockSchema = defineBlockSchema({
  flavour: 'linvo:embed-iframe',
  props: () => defaultEmbedIframeProps,
  metadata: {
    version: 1,
    role: 'content',
  },
  toModel: () => new EmbedIframeBlockModel(),
});

export const EmbedIframeBlockSchemaExtension = BlockSchemaExtension(
  EmbedIframeBlockSchema
);
