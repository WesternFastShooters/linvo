import {
  EmbedLoomBlockSchema,
  type EmbedLoomModel,
  EmbedLoomStyles,
} from '@linvo/linvo-model';
import { EmbedOptionConfig } from '@linvo/linvo-shared/services';
import { BlockService } from '@linvo/std';

import { loomUrlRegex } from './embed-loom-model.js';
import { queryEmbedLoomData } from './utils.js';

export class EmbedLoomBlockService extends BlockService {
  static override readonly flavour = EmbedLoomBlockSchema.model.flavour;

  queryUrlData = (embedLoomModel: EmbedLoomModel, signal?: AbortSignal) => {
    return queryEmbedLoomData(embedLoomModel, signal);
  };
}

export const EmbedLoomBlockOptionConfig = EmbedOptionConfig({
  flavour: EmbedLoomBlockSchema.model.flavour,
  urlRegex: loomUrlRegex,
  styles: EmbedLoomStyles,
  viewType: 'embed',
});
