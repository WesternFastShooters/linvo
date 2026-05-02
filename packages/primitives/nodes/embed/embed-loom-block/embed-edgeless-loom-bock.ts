import { EmbedLoomBlockSchema } from '@linvo-core/content';

import { createEmbedEdgelessBlockInteraction } from '../embed-shared/embed-block-element';
import { toEdgelessEmbedBlock } from '../embed-shared/to-edgeless-embed-block';
import { EmbedLoomBlockComponent } from './embed-loom-block';

export class EmbedEdgelessLoomBlockComponent extends toEdgelessEmbedBlock(
  EmbedLoomBlockComponent
) {}

export const EmbedLoomBlockInteraction = createEmbedEdgelessBlockInteraction(
  EmbedLoomBlockSchema.model.flavour
);
