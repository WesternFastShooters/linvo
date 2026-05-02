import { ShapeType } from '@linvo-core/content';
import { MAGIC_BRUSH_MIN_BOUND_SIZE, MAGIC_BRUSH_MIN_PATH_LENGTH, MAGIC_BRUSH_MIN_SCORE, } from './magic-brush-consts';
const MAGIC_BRUSH_POINT_COUNT = 32;
const ORIGIN = { x: 0, y: 0, id: 0 };
// Derived from the official $P recognizer reference implementation:
// https://depts.washington.edu/acelab/proj/dollar/pdollar.html
const MAGIC_BRUSH_TEMPLATES = [
    createTemplate('rectangle', polylineToStrokes([
        [10, 10],
        [170, 10],
        [170, 110],
        [10, 110],
        [10, 10],
    ], true)),
    createTemplate('square', polylineToStrokes([
        [10, 10],
        [150, 10],
        [150, 150],
        [10, 150],
        [10, 10],
    ], true)),
    createTemplate('ellipse', [sampleEllipse(180, 120)]),
    createTemplate('circle', [sampleEllipse(150, 150)]),
    createTemplate('triangle', polylineToStrokes([
        [90, 10],
        [170, 150],
        [10, 150],
        [90, 10],
    ], true)),
    createTemplate('diamond', polylineToStrokes([
        [90, 10],
        [170, 90],
        [90, 170],
        [10, 90],
        [90, 10],
    ], true)),
    createTemplate('arrow-right', [
        sampleLine([10, 90], [170, 90]),
        sampleLine([120, 40], [170, 90]),
        sampleLine([120, 140], [170, 90]),
    ]),
    createTemplate('arrow-left', [
        sampleLine([170, 90], [10, 90]),
        sampleLine([60, 40], [10, 90]),
        sampleLine([60, 140], [10, 90]),
    ]),
];
export function recognizeMagicBrush(strokes) {
    const normalizedStrokes = normalizeStrokes(strokes);
    if (!normalizedStrokes.length) {
        return null;
    }
    const bounds = getBounds(normalizedStrokes);
    if (Math.max(bounds.w, bounds.h) < MAGIC_BRUSH_MIN_BOUND_SIZE ||
        getPathLengthFromStrokes(normalizedStrokes) < MAGIC_BRUSH_MIN_PATH_LENGTH) {
        return null;
    }
    const points = flattenPoints(normalizedStrokes);
    const candidate = normalizePointCloud(points);
    const aspectRatio = getAspectRatio(bounds);
    const ranked = MAGIC_BRUSH_TEMPLATES.map(template => {
        const distance = greedyCloudMatch(candidate, template.points);
        const score = distance > 1 ? 1 / distance : 1;
        return { template, distance, score };
    }).sort((left, right) => left.distance - right.distance);
    for (const { template, score } of ranked) {
        if (score < MAGIC_BRUSH_MIN_SCORE) {
            return null;
        }
        if (!passesHeuristics(template.kind, bounds, aspectRatio)) {
            continue;
        }
        if (template.kind === 'arrow-left' || template.kind === 'arrow-right') {
            return {
                type: 'connector',
                kind: template.kind,
                bounds,
                score,
            };
        }
        const { shapeType, enforceSquare } = mapKindToShape(template.kind);
        return {
            type: 'shape',
            kind: template.kind,
            bounds,
            score,
            shapeType,
            enforceSquare,
        };
    }
    return null;
}
function createTemplate(kind, strokes) {
    return {
        kind,
        points: normalizePointCloud(flattenPoints(strokes)),
    };
}
function polylineToStrokes(points, close = false) {
    const stroke = samplePolyline(points, close ? 14 : 12);
    return [stroke];
}
function samplePolyline(points, samplesPerSegment) {
    const sampled = [];
    for (let index = 1; index < points.length; index++) {
        const start = points[index - 1];
        const end = points[index];
        for (let step = 0; step < samplesPerSegment; step++) {
            const t = step / samplesPerSegment;
            sampled.push([
                start[0] + (end[0] - start[0]) * t,
                start[1] + (end[1] - start[1]) * t,
            ]);
        }
    }
    sampled.push(points[points.length - 1]);
    return sampled;
}
function sampleEllipse(width, height, count = 48) {
    const rx = width / 2;
    const ry = height / 2;
    const cx = rx + 10;
    const cy = ry + 10;
    return Array.from({ length: count + 1 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / count;
        return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
    });
}
function sampleLine(start, end, count = 12) {
    return Array.from({ length: count + 1 }, (_, index) => {
        const t = index / count;
        return [
            start[0] + (end[0] - start[0]) * t,
            start[1] + (end[1] - start[1]) * t,
        ];
    });
}
function normalizeStrokes(strokes) {
    return strokes
        .map(stroke => stroke
        .filter(point => Number.isFinite(point[0]) &&
        Number.isFinite(point[1]) &&
        !Number.isNaN(point[0]) &&
        !Number.isNaN(point[1]))
        .map(([x, y]) => [x, y]))
        .filter(stroke => stroke.length > 0);
}
function flattenPoints(strokes) {
    return strokes.flatMap((stroke, strokeIndex) => stroke.map(([x, y]) => ({
        x,
        y,
        id: strokeIndex + 1,
    })));
}
function normalizePointCloud(points) {
    let normalized = resample(points, MAGIC_BRUSH_POINT_COUNT);
    normalized = scale(normalized);
    normalized = translateTo(normalized, ORIGIN);
    return normalized;
}
function resample(input, targetCount) {
    if (!input.length)
        return [];
    if (input.length === 1) {
        return Array.from({ length: targetCount }, () => ({ ...input[0] }));
    }
    const pathLength = getPathLength(input);
    if (pathLength === 0) {
        return Array.from({ length: targetCount }, () => ({ ...input[0] }));
    }
    const interval = pathLength / (targetCount - 1);
    const points = input.map(point => ({ ...point }));
    const result = [{ ...points[0] }];
    let distanceAccumulator = 0;
    for (let index = 1; index < points.length; index++) {
        const prev = points[index - 1];
        const current = points[index];
        if (current.id !== prev.id) {
            distanceAccumulator = 0;
            continue;
        }
        const segmentLength = distance(prev, current);
        if (segmentLength === 0) {
            continue;
        }
        if (distanceAccumulator + segmentLength >= interval) {
            const ratio = (interval - distanceAccumulator) / segmentLength;
            const point = {
                x: prev.x + ratio * (current.x - prev.x),
                y: prev.y + ratio * (current.y - prev.y),
                id: current.id,
            };
            result.push(point);
            points.splice(index, 0, point);
            distanceAccumulator = 0;
        }
        else {
            distanceAccumulator += segmentLength;
        }
    }
    if (result.length === targetCount - 1) {
        result.push({ ...points[points.length - 1] });
    }
    while (result.length < targetCount) {
        result.push({ ...points[points.length - 1] });
    }
    return result;
}
function scale(points) {
    const bounds = getBoundsFromPointCloud(points);
    const size = Math.max(bounds.w, bounds.h);
    if (size === 0) {
        return points.map(point => ({
            x: 0,
            y: 0,
            id: point.id,
        }));
    }
    return points.map(point => ({
        x: (point.x - bounds.x) / size,
        y: (point.y - bounds.y) / size,
        id: point.id,
    }));
}
function translateTo(points, target) {
    const centroid = getCentroid(points);
    return points.map(point => ({
        x: point.x + target.x - centroid.x,
        y: point.y + target.y - centroid.y,
        id: point.id,
    }));
}
function getCentroid(points) {
    const total = points.reduce((sum, point) => {
        sum.x += point.x;
        sum.y += point.y;
        return sum;
    }, { x: 0, y: 0 });
    return {
        x: total.x / points.length,
        y: total.y / points.length,
        id: 0,
    };
}
function greedyCloudMatch(points, template) {
    const epsilon = 0.5;
    const step = Math.max(1, Math.floor(Math.pow(points.length, 1 - epsilon)));
    let minimum = Number.POSITIVE_INFINITY;
    for (let index = 0; index < points.length; index += step) {
        const d1 = cloudDistance(points, template, index);
        const d2 = cloudDistance(template, points, index);
        minimum = Math.min(minimum, d1, d2);
    }
    return minimum;
}
function cloudDistance(left, right, start) {
    const matched = new Array(left.length).fill(false);
    let sum = 0;
    let index = start;
    do {
        let minDistance = Number.POSITIVE_INFINITY;
        let minIndex = -1;
        for (let candidateIndex = 0; candidateIndex < matched.length; candidateIndex++) {
            if (matched[candidateIndex])
                continue;
            const d = distance(left[index], right[candidateIndex]);
            if (d < minDistance) {
                minDistance = d;
                minIndex = candidateIndex;
            }
        }
        matched[minIndex] = true;
        const weight = 1 - ((index - start + left.length) % left.length) / left.length;
        sum += weight * minDistance;
        index = (index + 1) % left.length;
    } while (index !== start);
    return sum;
}
function distance(left, right) {
    const dx = right.x - left.x;
    const dy = right.y - left.y;
    return Math.hypot(dx, dy);
}
function getPathLength(points) {
    let total = 0;
    for (let index = 1; index < points.length; index++) {
        if (points[index].id === points[index - 1].id) {
            total += distance(points[index - 1], points[index]);
        }
    }
    return total;
}
function getPathLengthFromStrokes(strokes) {
    let total = 0;
    for (const stroke of strokes) {
        for (let index = 1; index < stroke.length; index++) {
            const prev = stroke[index - 1];
            const point = stroke[index];
            total += Math.hypot(point[0] - prev[0], point[1] - prev[1]);
        }
    }
    return total;
}
function getBounds(strokes) {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const stroke of strokes) {
        for (const [x, y] of stroke) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
    }
    return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
    };
}
function getBoundsFromPointCloud(points) {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const point of points) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    }
    return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
    };
}
function getAspectRatio(bounds) {
    const longest = Math.max(bounds.w, bounds.h);
    const shortest = Math.min(bounds.w, bounds.h);
    return longest === 0 ? 1 : shortest / longest;
}
function passesHeuristics(kind, bounds, aspectRatio) {
    switch (kind) {
        case 'square':
        case 'circle':
            return aspectRatio >= 0.76;
        case 'rectangle':
        case 'ellipse':
            return aspectRatio <= 0.9;
        case 'arrow-left':
        case 'arrow-right':
            return bounds.w >= bounds.h * 1.05;
        default:
            return true;
    }
}
function mapKindToShape(kind) {
    switch (kind) {
        case 'rectangle':
            return { shapeType: ShapeType.Rect, enforceSquare: false };
        case 'square':
            return { shapeType: ShapeType.Rect, enforceSquare: true };
        case 'ellipse':
            return { shapeType: ShapeType.Ellipse, enforceSquare: false };
        case 'circle':
            return { shapeType: ShapeType.Ellipse, enforceSquare: true };
        case 'triangle':
            return { shapeType: ShapeType.Triangle, enforceSquare: false };
        case 'diamond':
            return { shapeType: ShapeType.Diamond, enforceSquare: false };
    }
}
