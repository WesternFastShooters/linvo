import type { CanvasElementWithText } from '@linvo/linvo-block-surface';
import type { PanTool } from '@linvo/linvo-gfx-pointer';
import {
  type AttachmentBlockModel,
  type Connectable,
  type EdgelessTextBlockModel,
  type EmbedSyncedDocModel,
  type ImageBlockModel,
  ShapeElementModel,
  TextElementModel,
} from '@linvo/linvo-model';
import { isTopLevelBlock } from '@linvo/linvo-shared/utils';
import type {
  GfxModel,
  GfxPrimitiveElementModel,
  ToolOptionWithType,
} from '@linvo/std/gfx';
import type { BlockModel } from '@linvo/store';

import { drawingCursor, magicDrawingCursor } from './cursors';

export function isEdgelessTextBlock(
  element: BlockModel | GfxModel | null
): element is EdgelessTextBlockModel {
  return (
    !!element &&
    'flavour' in element &&
    element.flavour === 'linvo:edgeless-text'
  );
}

export function isImageBlock(
  element: BlockModel | GfxModel | null
): element is ImageBlockModel {
  return (
    !!element && 'flavour' in element && element.flavour === 'linvo:image'
  );
}

export function isAttachmentBlock(
  element: BlockModel | GfxModel | null
): element is AttachmentBlockModel {
  return (
    !!element && 'flavour' in element && element.flavour === 'linvo:attachment'
  );
}

export function isEmbedSyncedDocBlock(
  element: BlockModel | GfxModel | null
): element is EmbedSyncedDocModel {
  return (
    !!element &&
    'flavour' in element &&
    element.flavour === 'linvo:embed-synced-doc'
  );
}

export function isCanvasElement(
  selectable: GfxModel | BlockModel | null
): selectable is GfxPrimitiveElementModel {
  return !isTopLevelBlock(selectable);
}

export function isCanvasElementWithText(
  element: GfxModel
): element is CanvasElementWithText {
  return (
    element instanceof TextElementModel || element instanceof ShapeElementModel
  );
}

export function isConnectable(
  element: GfxModel | null
): element is Connectable {
  return !!element && element.connectable;
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
export function getCursorMode(edgelessTool: ToolOptionWithType) {
  if (!edgelessTool) {
    return 'default';
  }
  switch (edgelessTool.toolType?.toolName) {
    case 'default':
      return 'default';
    case 'pan':
      return (edgelessTool as ToolOptionWithType<PanTool>).options?.panning
        ? 'grabbing'
        : 'grab';
    case 'brush':
    case 'highlighter':
      return drawingCursor;
    case 'magic-brush':
      return magicDrawingCursor;
    case 'eraser':
    case 'shape':
    case 'connector':
    case 'frame':
    case 'linvo:note':
      return 'crosshair';
    case 'text':
      return 'text';
    default:
      return 'default';
  }
}
