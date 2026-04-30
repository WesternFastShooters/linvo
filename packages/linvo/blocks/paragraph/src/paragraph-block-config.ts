import type { ParagraphBlockModel } from '@linvo/linvo-model';
import { ConfigExtensionFactory } from '@linvo/std';

export interface ParagraphBlockConfig {
  getPlaceholder: (model: ParagraphBlockModel) => string;
}

export const ParagraphBlockConfigExtension =
  ConfigExtensionFactory<ParagraphBlockConfig>('linvo:paragraph');
