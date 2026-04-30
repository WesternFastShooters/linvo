import type { Rect } from '@linvo/linvo-gfx-turbo-renderer';
import {
  BlockLayoutHandlerExtension,
  BlockLayoutHandlersIdentifier,
} from '@linvo/linvo-gfx-turbo-renderer';
import type { Container } from '@linvo/global/di';
import type { EditorHost, GfxBlockComponent } from '@linvo/std';
import { clientToModelCoord, type ViewportRecord } from '@linvo/std/gfx';
import type { BlockModel } from '@linvo/store';

import type { CodeLayout } from './code-painter.worker';

export class CodeLayoutHandlerExtension extends BlockLayoutHandlerExtension<CodeLayout> {
  readonly blockType = 'linvo:code';

  static override setup(di: Container) {
    di.addImpl(
      BlockLayoutHandlersIdentifier('code'),
      CodeLayoutHandlerExtension
    );
  }

  override queryLayout(
    model: BlockModel,
    host: EditorHost,
    viewportRecord: ViewportRecord
  ): CodeLayout | null {
    const component = host.std.view.getBlock(
      model.id
    ) as GfxBlockComponent | null;
    if (!component) return null;

    const codeBlockElement = component.querySelector(
      '.linvo-code-block-container'
    );
    if (!codeBlockElement) return null;

    const { zoom, viewScale } = viewportRecord;
    const codeLayout: CodeLayout = {
      type: 'linvo:code',
      blockId: model.id,
      rect: { x: 0, y: 0, w: 0, h: 0 },
    };

    // Get the bounding rect of the code block
    const clientRect = codeBlockElement.getBoundingClientRect();
    if (!clientRect) return null;

    // Convert client coordinates to model coordinates
    const [modelX, modelY] = clientToModelCoord(viewportRecord, [
      clientRect.x,
      clientRect.y,
    ]);

    codeLayout.rect = {
      x: modelX,
      y: modelY,
      w: clientRect.width / zoom / viewScale,
      h: clientRect.height / zoom / viewScale,
    };

    return codeLayout;
  }

  calculateBound(layout: CodeLayout) {
    const rect: Rect = layout.rect;

    return {
      rect,
      subRects: [rect],
    };
  }
}
