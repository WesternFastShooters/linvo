import { EmbedYoutubeBlockSchema } from '@linvo-core/content';

import { createEmbedEdgelessBlockInteraction } from '../embed-shared/embed-block-element';
import { toEdgelessEmbedBlock } from '../embed-shared/to-edgeless-embed-block';
import { EmbedYoutubeBlockComponent } from './embed-youtube-block';

export class EmbedEdgelessYoutubeBlockComponent extends toEdgelessEmbedBlock(
  EmbedYoutubeBlockComponent
) {}

export const EmbedYoutubeBlockInteraction = createEmbedEdgelessBlockInteraction(
  EmbedYoutubeBlockSchema.model.flavour
);
