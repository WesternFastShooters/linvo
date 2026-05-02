import type { RoughCanvas } from '@linvo-core/block-surface';
import { Shape } from './shape';
export declare class RectShape extends Shape {
    draw(ctx: CanvasRenderingContext2D, rc: RoughCanvas): void;
}
