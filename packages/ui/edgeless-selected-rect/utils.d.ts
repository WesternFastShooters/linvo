import { type Options, Overlay, type RoughCanvas } from '@linvo-core/block-surface';
import { ShapeElementModel, type ShapeName, type ShapeStyle } from '@linvo-core/content';
import { Bound, type XYWH } from '@linvo-core/global/gfx';
import type { BlockComponent } from '@linvo-core/std';
import type { CursorType, GfxController, ResizeHandle, StandardCursor } from '@linvo-core/std/gfx';
export declare enum Direction {
    Right = 0,
    Bottom = 1,
    Left = 2,
    Top = 3
}
export declare const PANEL_WIDTH = 136;
export declare const PANEL_HEIGHT = 108;
export declare const MAIN_GAP = 100;
export declare const SECOND_GAP = 20;
export declare const DEFAULT_TEXT_WIDTH = 116;
export declare const DEFAULT_TEXT_HEIGHT = 24;
export type TARGET_SHAPE_TYPE = ShapeName;
export type AUTO_COMPLETE_TARGET_TYPE = TARGET_SHAPE_TYPE | 'text' | 'frame';
declare class AutoCompleteTargetOverlay extends Overlay {
    xywh: XYWH;
    constructor(gfx: GfxController, xywh: XYWH);
    render(_ctx: CanvasRenderingContext2D, _rc: RoughCanvas): void;
}
export declare class AutoCompleteTextOverlay extends AutoCompleteTargetOverlay {
    constructor(gfx: GfxController, xywh: XYWH);
    render(ctx: CanvasRenderingContext2D, _rc: RoughCanvas): void;
}
export declare class AutoCompleteFrameOverlay extends AutoCompleteTargetOverlay {
    private readonly _strokeColor;
    constructor(gfx: GfxController, xywh: XYWH, strokeColor: string);
    render(ctx: CanvasRenderingContext2D, _rc: RoughCanvas): void;
}
export declare class AutoCompleteShapeOverlay extends Overlay {
    private readonly _shape;
    constructor(gfx: GfxController, xywh: XYWH, type: TARGET_SHAPE_TYPE, options: Options, shapeStyle: ShapeStyle);
    render(ctx: CanvasRenderingContext2D, rc: RoughCanvas): void;
}
export declare function nextBound(type: Direction, curShape: ShapeElementModel, elements: ShapeElementModel[]): Bound;
export declare function getPosition(type: Direction): {
    startPosition: [number, number];
    endPosition: [number, number];
};
export declare function isShape(element: unknown): element is ShapeElementModel;
export declare function capitalizeFirstLetter(str: string): string;
export declare function createEdgelessElement(edgeless: BlockComponent, current: ShapeElementModel, bound: Bound): string | null;
export declare function createShapeElement(edgeless: BlockComponent, current: ShapeElementModel, targetType: TARGET_SHAPE_TYPE): string | null;
export declare function generateCursorUrl(angle: number | undefined, handle: ResizeHandle, fallback?: StandardCursor): CursorType;
export declare function getRotatedResizeCursor(option: {
    handle: ResizeHandle;
    angle: number;
}): StandardCursor;
export {};
