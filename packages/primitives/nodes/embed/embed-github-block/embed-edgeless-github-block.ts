import { EmbedGithubBlockSchema } from '@linvo-core/content';

import { createEmbedEdgelessBlockInteraction } from '../embed-shared/embed-block-element';
import { toEdgelessEmbedBlock } from '../embed-shared/to-edgeless-embed-block';
import { EmbedGithubBlockComponent } from './embed-github-block';

export class EmbedEdgelessGithubBlockComponent extends toEdgelessEmbedBlock(
  EmbedGithubBlockComponent
) {}

export const EmbedGithubBlockInteraction = createEmbedEdgelessBlockInteraction(
  EmbedGithubBlockSchema.model.flavour
);
