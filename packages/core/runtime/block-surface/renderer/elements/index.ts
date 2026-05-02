import type { IBound } from '@linvo-core/global/gfx';
import type {
  GfxLocalElementModel,
  GfxPrimitiveElementModel,
} from '@linvo-core/std/gfx';

import type { RoughCanvas } from '../..';
import type { CanvasRenderer } from '../canvas-renderer';

export type ElementRenderer<
  T extends
    | GfxPrimitiveElementModel
    | GfxLocalElementModel = GfxPrimitiveElementModel,
> = (
  model: T,
  ctx: CanvasRenderingContext2D,
  matrix: DOMMatrix,
  renderer: CanvasRenderer,
  rc: RoughCanvas,
  viewportBound: IBound
) => void;

export const elementRendererExtensions = [];
