import { type Options, type RoughCanvas, ToolOverlay } from '@linvo-core/block-surface';
import { type Color, type ShapeStyle } from '@linvo-core/content';
import type { GfxController } from '@linvo-core/std/gfx';
import type { Shape } from './shape';
export declare class ShapeOverlay extends ToolOverlay {
    shape: Shape;
    constructor(gfx: GfxController, type: string, options: Options, style: {
        shapeStyle: ShapeStyle;
        fillColor: Color;
        strokeColor: Color;
    });
    render(ctx: CanvasRenderingContext2D, rc: RoughCanvas): void;
}
