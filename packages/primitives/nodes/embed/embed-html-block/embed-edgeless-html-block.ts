import { EmbedHtmlBlockSchema } from '@linvo-core/content';

import { createEmbedEdgelessBlockInteraction } from '../embed-shared/embed-block-element';
import { toEdgelessEmbedBlock } from '../embed-shared/to-edgeless-embed-block';
import { EmbedHtmlBlockComponent } from './embed-html-block';
import { EMBED_HTML_MIN_HEIGHT, EMBED_HTML_MIN_WIDTH } from './styles';

export class EmbedEdgelessHtmlBlockComponent extends toEdgelessEmbedBlock(
  EmbedHtmlBlockComponent
) {}

export const EmbedEdgelessHtmlBlockInteraction =
  createEmbedEdgelessBlockInteraction(EmbedHtmlBlockSchema.model.flavour, {
    resizeConstraint: {
      minWidth: EMBED_HTML_MIN_WIDTH,
      minHeight: EMBED_HTML_MIN_HEIGHT,
      lockRatio: false,
    },
  });
