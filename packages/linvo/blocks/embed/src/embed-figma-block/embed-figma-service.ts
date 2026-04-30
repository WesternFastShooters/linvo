import {
  EmbedFigmaBlockSchema,
  EmbedFigmaStyles,
} from '@linvo/linvo-model';
import { EmbedOptionConfig } from '@linvo/linvo-shared/services';

import { figmaUrlRegex } from './embed-figma-model.js';

export const EmbedFigmaBlockOptionConfig = EmbedOptionConfig({
  flavour: EmbedFigmaBlockSchema.model.flavour,
  urlRegex: figmaUrlRegex,
  styles: EmbedFigmaStyles,
  viewType: 'embed',
});
