import type { GfxCompatibleProps } from '@linvo-core/std/gfx';
import { BlockModel } from '@linvo-core/store';

import type { ReferenceInfo } from '../../../definitions/doc';
import type { EmbedCardStyle } from '../../../helpers';
import { defineEmbedModel } from '../../../helpers';

export const EmbedSyncedDocStyles = [
  'syncedDoc',
] as const satisfies EmbedCardStyle[];

export type EmbedSyncedDocBlockProps = {
  style: EmbedCardStyle;
  caption?: string | null;
  scale?: number;
  /**
   * Record the scaled height of the synced doc block when it is folded,
   * a.k.a the fourth number of the `xywh`
   */
  preFoldHeight?: number;
} & ReferenceInfo &
  GfxCompatibleProps;

export class EmbedSyncedDocModel extends defineEmbedModel<EmbedSyncedDocBlockProps>(
  BlockModel
) {
  get isFolded() {
    return !!this.props.preFoldHeight$.value;
  }
}
