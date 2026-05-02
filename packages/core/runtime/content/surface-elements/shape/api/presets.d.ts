import type { IBound, IVec } from '@linvo-core/global/gfx';
export declare const hexagon: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const pentagon: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const octagon: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const parallelogram: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const leanLeft: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const trapezoid: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const trapezoidAlt: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const stadium: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const subroutine: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const cylinder: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const horizontalCylinder: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const linedCylinder: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const document: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const linedDocument: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const multiDocument: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const note: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const packageShape: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const cloud: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const doubleCircle: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const filledCircle: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const asymmetric: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const hourglass: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const notchedRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const notchedPentagon: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const bolt: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const bang: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const flag: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const bowRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const smallCircle: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const framedCircle: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const crossedCircle: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const taggedDocument: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const taggedRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const braceLeft: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const braceRight: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const braces: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const delay: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const curvedTrapezoid: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const dividedRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const forkJoin: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const windowPane: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const linedRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const flippedTriangle: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const slopedRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const stackedRect: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const odd: {
    points: (bound: IBound) => IVec[];
    draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
    includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
    containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
    getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
    getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
    getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
};
export declare const presetShapeMethods: {
    hexagon: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    pentagon: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    octagon: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    parallelogram: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    leanLeft: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    trapezoid: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    trapezoidAlt: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    stadium: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    subroutine: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    cylinder: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    horizontalCylinder: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    linedCylinder: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    document: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    linedDocument: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    multiDocument: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    note: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    package: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    cloud: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    doubleCircle: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    filledCircle: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    asymmetric: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    hourglass: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    notchedRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    notchedPentagon: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    bolt: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    bang: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    flag: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    bowRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    smallCircle: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    framedCircle: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    crossedCircle: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    taggedDocument: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    taggedRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    braceLeft: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    braceRight: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    braces: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    delay: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    curvedTrapezoid: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    dividedRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    forkJoin: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    windowPane: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    linedRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    flippedTriangle: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    slopedRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    stackedRect: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
    odd: {
        points: (bound: IBound) => IVec[];
        draw(ctx: CanvasRenderingContext2D, bound: IBound): void;
        includesPoint(this: import("..").ShapeElementModel, x: number, y: number, options: import("@linvo-core/std/gfx").PointTestOptions): boolean;
        containsBound(bounds: import("@linvo-core/global/gfx").Bound, element: import("..").ShapeElementModel): boolean;
        getNearestPoint(point: IVec, element: import("..").ShapeElementModel): IVec;
        getLineIntersections(start: IVec, end: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation[] | null;
        getRelativePointLocation(position: IVec, element: import("..").ShapeElementModel): import("@linvo-core/global/gfx").PointLocation;
    };
};
