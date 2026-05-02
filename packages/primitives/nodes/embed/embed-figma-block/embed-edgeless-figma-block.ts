import { EmbedFigmaBlockSchema } from '@linvo-core/content';

import { createEmbedEdgelessBlockInteraction } from '../embed-shared/embed-block-element';
import { toEdgelessEmbedBlock } from '../embed-shared/to-edgeless-embed-block';
import { EmbedFigmaBlockComponent } from './embed-figma-block';

export class EmbedEdgelessBlockComponent extends toEdgelessEmbedBlock(
  EmbedFigmaBlockComponent
) {}

export const EmbedFigmaBlockInteraction = createEmbedEdgelessBlockInteraction(
  EmbedFigmaBlockSchema.model.flavour
);
