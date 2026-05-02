import type { CanvasRenderer, RoughCanvas } from '@linvo-core/block-surface';
import type { LocalShapeElementModel, ShapeElementModel } from '@linvo-core/content';
import { type Colors } from './utils';
export declare function custom(model: ShapeElementModel | LocalShapeElementModel, ctx: CanvasRenderingContext2D, matrix: DOMMatrix, renderer: CanvasRenderer, rc: RoughCanvas, colors: Colors): void;
