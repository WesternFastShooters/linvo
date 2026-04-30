import type {
  CanvasRenderer,
  RoughCanvas,
} from '@linvo/linvo-block-surface';
import type {
  LocalShapeElementModel,
  ShapeElementModel,
} from '@linvo/linvo-model';

import {
  drawPresetShapeOverlayRough,
  drawPresetShapeUnderlayRough,
  getPresetShapePoints,
  isPresetShapeType,
} from '../../preset-shape-utils.js';
import { type Colors, drawGeneralShape } from './utils.js';

export function custom(
  model: ShapeElementModel | LocalShapeElementModel,
  ctx: CanvasRenderingContext2D,
  matrix: DOMMatrix,
  renderer: CanvasRenderer,
  rc: RoughCanvas,
  colors: Colors
) {
  const {
    seed,
    strokeWidth,
    filled,
    strokeStyle,
    roughness,
    rotate,
    shapeStyle,
    shapeType,
  } = model;
  const [, , w, h] = model.deserializedXYWH;
  const renderOffset = Math.max(strokeWidth, 0) / 2;
  const renderWidth = Math.max(1, w - renderOffset * 2);
  const renderHeight = Math.max(1, h - renderOffset * 2);
  const cx = renderWidth / 2;
  const cy = renderHeight / 2;
  const { fillColor, strokeColor } = colors;

  if (!isPresetShapeType(shapeType)) {
    return;
  }

  ctx.setTransform(
    matrix
      .translateSelf(renderOffset, renderOffset)
      .translateSelf(cx, cy)
      .rotateSelf(rotate)
      .translateSelf(-cx, -cy)
  );

  if (shapeStyle === 'General') {
    drawGeneralShape(ctx, model, renderer, filled, fillColor, strokeColor);
    return;
  }

  const options = {
    seed,
    roughness: shapeStyle === 'Scribbled' ? roughness : 0,
    strokeLineDash: strokeStyle === 'dash' ? [12, 12] : undefined,
    stroke: strokeStyle === 'none' ? 'none' : strokeColor,
    strokeWidth,
    fill: filled ? fillColor : undefined,
  };

  drawPresetShapeUnderlayRough(rc, shapeType, [0, 0, renderWidth, renderHeight], options);
  rc.polygon(
    getPresetShapePoints(shapeType, [0, 0, renderWidth, renderHeight], strokeWidth),
    options
  );
  drawPresetShapeOverlayRough(
    rc,
    shapeType,
    [0, 0, renderWidth, renderHeight],
    options
  );
}
