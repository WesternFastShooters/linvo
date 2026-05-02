import {
  EmbedGithubBlockSchema,
  type EmbedGithubModel,
  EmbedGithubStyles,
} from '@linvo-core/content';
import {
  EmbedOptionConfig,
  LinkPreviewServiceIdentifier,
} from '@linvo-core/shared/services';
import { BlockService } from '@linvo-core/std';

import { githubUrlRegex } from './embed-github-model';
import { queryEmbedGithubApiData, queryEmbedGithubData } from './utils';

export class EmbedGithubBlockService extends BlockService {
  static override readonly flavour = EmbedGithubBlockSchema.model.flavour;

  queryApiData = (embedGithubModel: EmbedGithubModel, signal?: AbortSignal) => {
    return queryEmbedGithubApiData(embedGithubModel, signal);
  };

  queryUrlData = (embedGithubModel: EmbedGithubModel, signal?: AbortSignal) => {
    return queryEmbedGithubData(
      embedGithubModel,
      this.std.get(LinkPreviewServiceIdentifier),
      signal
    );
  };
}

export const EmbedGithubBlockOptionConfig = EmbedOptionConfig({
  flavour: EmbedGithubBlockSchema.model.flavour,
  urlRegex: githubUrlRegex,
  styles: EmbedGithubStyles,
  viewType: 'card',
});
