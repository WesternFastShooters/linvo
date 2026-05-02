import type { CanvasRenderer } from '@linvo-core/block-surface';
import { type TextDelta } from '@linvo-primitives/text';
import type { LocalShapeElementModel, ShapeElementModel, TextAlign, TextVerticalAlign } from '@linvo-core/content';
import type { Bound } from '@linvo-core/global/gfx';
export type Colors = {
    color: string;
    fillColor: string;
    strokeColor: string;
};
export declare function drawGeneralShape(ctx: CanvasRenderingContext2D, shapeModel: ShapeElementModel | LocalShapeElementModel, renderer: CanvasRenderer, filled: boolean, fillColor: string, strokeColor: string): void;
export declare function horizontalOffset(width: number, textAlign: TextAlign, horiPadding: number): number;
export declare function verticalOffset(lines: TextDelta[][], lineHeight: number, height: number, textVerticalAlign: TextVerticalAlign, verticalPadding: number): number;
export declare function normalizeShapeBound(shape: ShapeElementModel, bound: Bound): Bound;
export declare function fitContent(shape: ShapeElementModel): void;
