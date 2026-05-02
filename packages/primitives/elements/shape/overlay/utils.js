import { shapeMethods } from '@linvo-core/content';
import { Bound } from '@linvo-core/global/gfx';
import { drawPresetShapeOverlay, drawPresetShapeUnderlay, isPresetShapeType, } from '../preset-shape-utils';
export const drawGeneralShape = (ctx, type, xywh, options) => {
    ctx.setLineDash(options.strokeLineDash ?? []);
    ctx.strokeStyle = options.stroke ?? 'transparent';
    ctx.lineWidth = options.strokeWidth ?? 2;
    ctx.fillStyle = options.fill ?? 'transparent';
    ctx.beginPath();
    const bound = Bound.fromXYWH(xywh);
    const strokeWidth = options.strokeWidth ?? 2;
    if (isPresetShapeType(type)) {
        drawPresetShapeUnderlay(ctx, type, xywh, strokeWidth);
    }
    switch (type) {
        case 'rect':
            shapeMethods.rect.draw(ctx, bound);
            break;
        case 'triangle':
            shapeMethods.triangle.draw(ctx, bound);
            break;
        case 'diamond':
            shapeMethods.diamond.draw(ctx, bound);
            break;
        case 'ellipse':
            shapeMethods.ellipse.draw(ctx, bound);
            break;
        case 'roundedRect':
            drawRoundedRect(ctx, xywh);
            break;
        default:
            if (isPresetShapeType(type)) {
                shapeMethods[type].draw(ctx, bound);
            }
            else {
                throw new Error(`Unknown shape type: ${type}`);
            }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (isPresetShapeType(type)) {
        drawPresetShapeOverlay(ctx, type, xywh, strokeWidth);
    }
};
function drawRoundedRect(ctx, xywh) {
    const [x, y, w, h] = xywh;
    const width = w;
    const height = h;
    const radius = 0.1;
    const cornerRadius = Math.min(width * radius, height * radius);
    ctx.moveTo(x + cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
    ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
    ctx.arcTo(x, y + height, x, y, cornerRadius);
    ctx.arcTo(x, y, x + width, y, cornerRadius);
}
