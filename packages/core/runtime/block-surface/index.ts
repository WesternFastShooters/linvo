// oxlint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./effects.ts" />
export * from './consts';
export { GRID_GAP_MAX, GRID_GAP_MIN } from './consts';
export {
  SurfaceElementModel,
  SurfaceGroupLikeModel,
} from './element-model/base';
export { CanvasElementType } from './element-model';
export { CanvasRenderer } from './renderer/canvas-renderer';
export { DomRenderer } from './renderer/dom-renderer';
export type { ElementRenderer } from './renderer/elements';
export * from './renderer/elements/type';
export { Overlay, OverlayIdentifier } from './renderer/overlay';
export { ToolOverlay } from './renderer/tool-overlay';
import {
  getFontFaces,
  getFontFacesByFontFamily,
  isSameFontFamily,
  wrapFontFamily,
} from './utils/font';
export * from './adapters';
export * from './extensions';
export type { SurfaceContext } from './surface-block';
export { SurfaceBlockComponent } from './surface-block';
export {
  SurfaceBlockModel,
  SurfaceBlockSchema,
  SurfaceBlockSchemaExtension,
} from './surface-model';
export { SurfaceBlockTransformer } from './surface-transformer';
export * from './tool/default-tool';
export {
  generateElementId,
  getBgGridGap,
  getLastPropsKey,
  getSurfaceBlock,
  getSurfaceComponent,
  normalizeWheelDeltaY,
} from './utils';
export { AStarRunner } from './utils/a-star';
export { RoughCanvas } from './utils/rough/canvas';
export { RoughSVG } from './utils/rough/svg';
export type { Options } from './utils/rough/core';
export { sortIndex } from './utils/sort';
export { updateXYWH } from './utils/update-xywh';

export const TextUtils = {
  wrapFontFamily,
  getFontFaces,
  getFontFacesByFontFamily,
  isSameFontFamily,
};

export * from './commands';
