import {
  EmbedYoutubeBlockSchema,
  type EmbedYoutubeModel,
  EmbedYoutubeStyles,
} from '@linvo-core/content';
import {
  EmbedOptionConfig,
  LinkPreviewServiceIdentifier,
} from '@linvo-core/shared/services';
import { BlockService } from '@linvo-core/std';

import { youtubeUrlRegex } from './embed-youtube-model';
import { queryEmbedYoutubeData } from './utils';

export class EmbedYoutubeBlockService extends BlockService {
  static override readonly flavour = EmbedYoutubeBlockSchema.model.flavour;

  queryUrlData = (
    embedYoutubeModel: EmbedYoutubeModel,
    signal?: AbortSignal
  ) => {
    return queryEmbedYoutubeData(
      embedYoutubeModel,
      this.std.get(LinkPreviewServiceIdentifier),
      signal
    );
  };
}

export const EmbedYoutubeBlockOptionConfig = EmbedOptionConfig({
  flavour: EmbedYoutubeBlockSchema.model.flavour,
  urlRegex: youtubeUrlRegex,
  styles: EmbedYoutubeStyles,
  viewType: 'embed',
});
