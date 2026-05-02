import { isPresetShapeType } from '../preset-shape-utils';
import { DiamondShape } from './diamond';
import { EllipseShape } from './ellipse';
import { PresetShape } from './preset';
import { RectShape } from './rect';
import { RoundedRectShape } from './rounded-rect';
import { TriangleShape } from './triangle';
export class ShapeFactory {
    static createShape(xywh, type, options, shapeStyle) {
        switch (type) {
            case 'rect':
                return new RectShape(xywh, type, options, shapeStyle);
            case 'triangle':
                return new TriangleShape(xywh, type, options, shapeStyle);
            case 'diamond':
                return new DiamondShape(xywh, type, options, shapeStyle);
            case 'ellipse':
                return new EllipseShape(xywh, type, options, shapeStyle);
            case 'roundedRect':
                return new RoundedRectShape(xywh, type, options, shapeStyle);
            default:
                if (isPresetShapeType(type)) {
                    return new PresetShape(xywh, type, options, shapeStyle);
                }
                throw new Error(`Unknown shape type: ${type}`);
        }
    }
}
