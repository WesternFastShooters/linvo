import {
  EmbedFigmaBlockSchema,
  EmbedFigmaStyles,
} from '@linvo-core/content';
import { EmbedOptionConfig } from '@linvo-core/shared/services';

import { figmaUrlRegex } from './embed-figma-model';

export const EmbedFigmaBlockOptionConfig = EmbedOptionConfig({
  flavour: EmbedFigmaBlockSchema.model.flavour,
  urlRegex: figmaUrlRegex,
  styles: EmbedFigmaStyles,
  viewType: 'embed',
});
