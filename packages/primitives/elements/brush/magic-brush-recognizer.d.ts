import { ShapeType } from '@linvo-core/content';
import type { IVec } from '@linvo-core/global/gfx';
export type MagicBrushBounds = {
    h: number;
    w: number;
    x: number;
    y: number;
};
export type MagicBrushKind = 'arrow-left' | 'arrow-right' | 'circle' | 'diamond' | 'ellipse' | 'rectangle' | 'square' | 'triangle';
export type MagicBrushMatch = {
    bounds: MagicBrushBounds;
    kind: 'arrow-left' | 'arrow-right';
    score: number;
    type: 'connector';
} | {
    bounds: MagicBrushBounds;
    enforceSquare: boolean;
    kind: 'circle' | 'diamond' | 'ellipse' | 'rectangle' | 'square' | 'triangle';
    score: number;
    shapeType: ShapeType;
    type: 'shape';
};
export declare function recognizeMagicBrush(strokes: readonly (readonly IVec[])[]): MagicBrushMatch | null;
