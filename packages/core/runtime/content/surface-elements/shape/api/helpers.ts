import type { IBound, IVec } from '@linvo-core/global/gfx';
import {
  Bound,
  getCenterAreaBounds,
  getPointsFromBoundWithRotation,
  linePolygonIntersects,
  pointInPolygon,
  PointLocation,
  pointOnPolygonStoke,
  polygonGetPointTangent,
  polygonNearestPoint,
  rotatePoints,
} from '@linvo-core/global/gfx';
import type { PointTestOptions } from '@linvo-core/std/gfx';

import { DEFAULT_CENTRAL_AREA_RATIO } from '../../../definitions';
import type { ShapeElementModel } from '../shape-element-model';

export function sampleEllipseArc(
  center: IVec,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  segments: number
): IVec[] {
  const points: IVec[] = [];
  const count = Math.max(segments, 1);
  for (let index = 0; index <= count; index++) {
    const t = index / count;
    const angle = startAngle + (endAngle - startAngle) * t;
    points.push([
      center[0] + Math.cos(angle) * radiusX,
      center[1] + Math.sin(angle) * radiusY,
    ]);
  }
  return points;
}

export function sampleWave(
  start: IVec,
  width: number,
  baseY: number,
  amplitude: number,
  segments: number
): IVec[] {
  const points: IVec[] = [];
  const count = Math.max(segments, 2);
  for (let index = 0; index <= count; index++) {
    const t = index / count;
    const x = start[0] + width * t;
    const y = baseY + amplitude * (1 - Math.cos(Math.PI * t)) * 0.5;
    points.push([x, y]);
  }
  return points;
}

export function tracePolygon(ctx: CanvasRenderingContext2D, points: IVec[]) {
  if (points.length === 0) return;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const point of points.slice(1)) {
    ctx.lineTo(point[0], point[1]);
  }
  ctx.closePath();
}

export function drawShapeWithRotation(
  ctx: CanvasRenderingContext2D,
  bound: IBound,
  trace: (ctx: CanvasRenderingContext2D, bound: IBound) => void
) {
  const { x, y, w, h, rotate = 0 } = bound;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.translate(-cx, -cy);
  trace(ctx, { x, y, w, h, rotate: 0 });
  ctx.restore();
}

export function createShapeMethod(
  points: (bound: IBound) => IVec[],
  trace: (ctx: CanvasRenderingContext2D, bound: IBound) => void
) {
  return {
    points,
    draw(ctx: CanvasRenderingContext2D, bound: IBound) {
      drawShapeWithRotation(ctx, bound, trace);
    },
    includesPoint(
      this: ShapeElementModel,
      x: number,
      y: number,
      options: PointTestOptions
    ) {
      const point: IVec = [x, y];
      const outlinePoints = getPointsFromBoundWithRotation(this, points);

      let hit = pointOnPolygonStoke(
        point,
        outlinePoints,
        (options?.hitThreshold ?? 1) / (options?.zoom ?? 1)
      );

      if (!hit) {
        if (!options.ignoreTransparent || this.filled) {
          hit = pointInPolygon(point, outlinePoints);
        } else {
          const text = this.text;
          if (!text || !text.length) {
            const centralBounds = getCenterAreaBounds(
              this,
              DEFAULT_CENTRAL_AREA_RATIO
            );
            const centralPoints = getPointsFromBoundWithRotation(
              centralBounds,
              points
            );
            hit = pointInPolygon(point, centralPoints);
          } else if (this.textBound) {
            hit = pointInPolygon(
              point,
              getPointsFromBoundWithRotation(
                this,
                () => Bound.from(this.textBound!).points
              )
            );
          }
        }
      }

      return hit;
    },
    containsBound(bounds: Bound, element: ShapeElementModel) {
      const outlinePoints = getPointsFromBoundWithRotation(element, points);
      return outlinePoints.some(point => bounds.containsPoint(point));
    },
    getNearestPoint(point: IVec, element: ShapeElementModel) {
      const outlinePoints = getPointsFromBoundWithRotation(element, points);
      return polygonNearestPoint(outlinePoints, point);
    },
    getLineIntersections(start: IVec, end: IVec, element: ShapeElementModel) {
      const outlinePoints = getPointsFromBoundWithRotation(element, points);
      return linePolygonIntersects(start, end, outlinePoints);
    },
    getRelativePointLocation(position: IVec, element: ShapeElementModel) {
      const bound = Bound.deserialize(element.xywh);
      const point = bound.getRelativePoint(position);
      const rotatedPoints = rotatePoints(
        [...points(bound), point],
        bound.center,
        element.rotate
      );
      const rotatedPoint = rotatedPoints.pop() as IVec;
      const tangent = polygonGetPointTangent(rotatedPoints, rotatedPoint);
      return new PointLocation(rotatedPoint, tangent);
    },
  };
}
