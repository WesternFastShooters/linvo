import type { Point } from '../rough/geometry';
export declare function simplify(points: readonly Point[], distance: number): Point[];
export declare function pointsOnBezierCurves(points: Point[], tolerance?: number, distance?: number): Point[];
