import { createIdentifier } from '@linvo/global/di';
import type { EditorHost } from '@linvo/std';
import type { ViewportRecord } from '@linvo/std/gfx';
import type { BlockModel } from '@linvo/store';
import { Extension } from '@linvo/store';

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
