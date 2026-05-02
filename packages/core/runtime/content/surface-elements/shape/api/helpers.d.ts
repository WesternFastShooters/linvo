import type { IBound, IVec } from '@linvo-core/global/gfx';
import { Bound, PointLocation } from '@linvo-core/global/gfx';
import type { PointTestOptions } from '@linvo-core/std/gfx';
import type { ShapeElementModel } from '../shape-element-model';
export declare function sampleEllipseArc(center: IVec, radiusX: number, radiusY: number, startAngle: number, endAngle: number, segments: number): IVec[];
export declare function sampleWave(start: IVec, width: number, baseY: number, amplitude: number, segments: number): IVec[];
export declare function tracePolygon(ctx: CanvasRenderingContext2D, points: IVec[]): void;
export declare function drawShapeWithRotation(ctx: CanvasRenderingContext2D, bound: IBound, trace: (ctx: CanvasRenderingContext2D, bound: IBound) => void): void;
export declare function createShapeMethod(points: (bound: IBound) => IVec[], trace: (ctx: CanvasRenderingContext2D, bound: IBound) => void): {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: ShapeElementModel, x: number, y: number, options: PointTestOptions): boolean;
    containsBound(bounds: Bound, element: ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: ShapeElementModel): PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: ShapeElementModel): PointLocation;
};
