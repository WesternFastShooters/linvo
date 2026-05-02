import {
  EmbedLoomBlockSchema,
  type EmbedLoomModel,
  EmbedLoomStyles,
} from '@linvo-core/content';
import { EmbedOptionConfig } from '@linvo-core/shared/services';
import { BlockService } from '@linvo-core/std';

import { loomUrlRegex } from './embed-loom-model';
import { queryEmbedLoomData } from './utils';

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
