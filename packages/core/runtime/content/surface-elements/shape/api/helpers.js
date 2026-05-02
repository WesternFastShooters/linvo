import { Bound, getCenterAreaBounds, getPointsFromBoundWithRotation, linePolygonIntersects, pointInPolygon, PointLocation, pointOnPolygonStoke, polygonGetPointTangent, polygonNearestPoint, rotatePoints, } from '@linvo-core/global/gfx';
import { DEFAULT_CENTRAL_AREA_RATIO } from '../../../definitions';
export function sampleEllipseArc(center, radiusX, radiusY, startAngle, endAngle, segments) {
    const points = [];
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
export function sampleWave(start, width, baseY, amplitude, segments) {
    const points = [];
    const count = Math.max(segments, 2);
    for (let index = 0; index <= count; index++) {
        const t = index / count;
        const x = start[0] + width * t;
        const y = baseY + amplitude * (1 - Math.cos(Math.PI * t)) * 0.5;
        points.push([x, y]);
    }
    return points;
}
export function tracePolygon(ctx, points) {
    if (points.length === 0)
        return;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const point of points.slice(1)) {
        ctx.lineTo(point[0], point[1]);
    }
    ctx.closePath();
}
export function drawShapeWithRotation(ctx, bound, trace) {
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
export function createShapeMethod(points, trace) {
    return {
        points,
        draw(ctx, bound) {
            drawShapeWithRotation(ctx, bound, trace);
        },
        includesPoint(x, y, options) {
            const point = [x, y];
            const outlinePoints = getPointsFromBoundWithRotation(this, points);
            let hit = pointOnPolygonStoke(point, outlinePoints, (options?.hitThreshold ?? 1) / (options?.zoom ?? 1));
            if (!hit) {
                if (!options.ignoreTransparent || this.filled) {
                    hit = pointInPolygon(point, outlinePoints);
                }
                else {
                    const text = this.text;
                    if (!text || !text.length) {
                        const centralBounds = getCenterAreaBounds(this, DEFAULT_CENTRAL_AREA_RATIO);
                        const centralPoints = getPointsFromBoundWithRotation(centralBounds, points);
                        hit = pointInPolygon(point, centralPoints);
                    }
                    else if (this.textBound) {
                        hit = pointInPolygon(point, getPointsFromBoundWithRotation(this, () => Bound.from(this.textBound).points));
                    }
                }
            }
            return hit;
        },
        containsBound(bounds, element) {
            const outlinePoints = getPointsFromBoundWithRotation(element, points);
            return outlinePoints.some(point => bounds.containsPoint(point));
        },
        getNearestPoint(point, element) {
            const outlinePoints = getPointsFromBoundWithRotation(element, points);
            return polygonNearestPoint(outlinePoints, point);
        },
        getLineIntersections(start, end, element) {
            const outlinePoints = getPointsFromBoundWithRotation(element, points);
            return linePolygonIntersects(start, end, outlinePoints);
        },
        getRelativePointLocation(position, element) {
            const bound = Bound.deserialize(element.xywh);
            const point = bound.getRelativePoint(position);
            const rotatedPoints = rotatePoints([...points(bound), point], bound.center, element.rotate);
            const rotatedPoint = rotatedPoints.pop();
            const tangent = polygonGetPointTangent(rotatedPoints, rotatedPoint);
            return new PointLocation(rotatedPoint, tangent);
        },
    };
}
