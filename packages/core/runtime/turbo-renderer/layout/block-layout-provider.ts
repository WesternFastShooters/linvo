import { createIdentifier } from '@linvo-core/composition/di';
import type { EditorHost } from '@linvo-core/std';
import type { ViewportRecord } from '@linvo-core/std/gfx';
import type { BlockModel } from '@linvo-core/store';
import { Extension } from '@linvo-core/store';

import type { BlockLayout, Rect } from '../types';

export abstract class BlockLayoutHandlerExtension<
  T extends BlockLayout = BlockLayout,
> extends Extension {
  abstract readonly blockType: string;

  abstract queryLayout(
    model: BlockModel,
    host: EditorHost,
    viewportRecord: ViewportRecord
  ): T | null;

  abstract calculateBound(layout: T): {
    rect: Rect;
    subRects: Rect[];
  };
}

export const BlockLayoutHandlersIdentifier =
  createIdentifier<BlockLayoutHandlerExtension>(
    'BlockLayoutHandlersIdentifier'
  );
