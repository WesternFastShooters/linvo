import type { Options } from '@linvo-core/block-surface';
import type { ShapeStyle } from '@linvo-core/content';
import type { XYWH } from '@linvo-core/global/gfx';
import type { Shape } from './shape';
export declare class ShapeFactory {
    static createShape(xywh: XYWH, type: string, options: Options, shapeStyle: ShapeStyle): Shape;
}
