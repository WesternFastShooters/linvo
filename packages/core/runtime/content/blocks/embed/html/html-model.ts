import { BlockModel } from '@linvo-core/store';

import type { EmbedCardStyle } from '../../../helpers';
import { defineEmbedModel } from '../../../helpers';

export const EmbedHtmlStyles = ['html'] as const satisfies EmbedCardStyle[];

export type EmbedHtmlBlockProps = {
  style: (typeof EmbedHtmlStyles)[number];
  caption: string | null;
  html?: string;
  design?: string;
};

export class EmbedHtmlModel extends defineEmbedModel<EmbedHtmlBlockProps>(
  BlockModel
) {}
