import type { Options, RoughCanvas } from '@linvo-core/block-surface';
import type { ShapeStyle } from '@linvo-core/content';
import type { XYWH } from '@linvo-core/global/gfx';
export declare abstract class Shape {
    options: Options;
    shapeStyle: ShapeStyle;
    type: string;
    xywh: XYWH;
    constructor(xywh: XYWH, type: string, options: Options, shapeStyle: ShapeStyle);
    abstract draw(ctx: CanvasRenderingContext2D, rc: RoughCanvas): void;
}
