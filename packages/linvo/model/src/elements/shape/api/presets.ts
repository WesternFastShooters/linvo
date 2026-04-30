import type { IBound, IVec } from '@linvo/global/gfx';

import { ShapeType } from '../../../consts/index.js';
import {
  createShapeMethod,
  sampleEllipseArc,
  sampleWave,
  tracePolygon,
} from './helpers.js';

function ellipsePoints(
  { x, y, w, h }: IBound,
  start = 0,
  end = Math.PI * 2,
  segments = 24
): IVec[] {
  return sampleEllipseArc([x + w / 2, y + h / 2], w / 2, h / 2, start, end, segments);
}

function regularPolygonPoints(
  { x, y, w, h }: IBound,
  sides: number,
  rotation = -Math.PI / 2
): IVec[] {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = w / 2;
  const ry = h / 2;

  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + (Math.PI * 2 * index) / sides;
    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry] as IVec;
  });
}

function traceFromPoints(points: (bound: IBound) => IVec[]) {
  return (ctx: CanvasRenderingContext2D, bound: IBound) =>
    tracePolygon(ctx, points(bound));
}

function hexagonPoints({ x, y, w, h }: IBound): IVec[] {
  const inset = w * 0.2;
  return [
    [x + inset, y],
    [x + w - inset, y],
    [x + w, y + h / 2],
    [x + w - inset, y + h],
    [x + inset, y + h],
    [x, y + h / 2],
  ];
}

function pentagonPoints(bound: IBound): IVec[] {
  return regularPolygonPoints(bound, 5);
}

function octagonPoints(bound: IBound): IVec[] {
  return regularPolygonPoints(bound, 8, Math.PI / 8);
}

function parallelogramPoints({ x, y, w, h }: IBound): IVec[] {
  const skew = w * 0.18;
  return [
    [x + skew, y],
    [x + w, y],
    [x + w - skew, y + h],
    [x, y + h],
  ];
}

function leanLeftPoints({ x, y, w, h }: IBound): IVec[] {
  const skew = w * 0.18;
  return [
    [x, y],
    [x + w - skew, y],
    [x + w, y + h],
    [x + skew, y + h],
  ];
}

function trapezoidPoints({ x, y, w, h }: IBound): IVec[] {
  const inset = w * 0.18;
  return [
    [x + inset, y],
    [x + w - inset, y],
    [x + w, y + h],
    [x, y + h],
  ];
}

function trapezoidAltPoints({ x, y, w, h }: IBound): IVec[] {
  const inset = w * 0.18;
  return [
    [x, y],
    [x + w, y],
    [x + w - inset, y + h],
    [x + inset, y + h],
  ];
}

function stadiumPoints({ x, y, w, h }: IBound): IVec[] {
  const radius = Math.min(h / 2, w / 2);
  const leftCenter: IVec = [x + radius, y + h / 2];
  const rightCenter: IVec = [x + w - radius, y + h / 2];
  return [
    [x + radius, y],
    [x + w - radius, y],
    ...sampleEllipseArc(
      rightCenter,
      radius,
      radius,
      -Math.PI / 2,
      Math.PI / 2,
      8
    ).slice(1),
    [x + radius, y + h],
    ...sampleEllipseArc(
      leftCenter,
      radius,
      radius,
      Math.PI / 2,
      (Math.PI * 3) / 2,
      8
    ).slice(1),
  ];
}

function cylinderPoints({ x, y, w, h }: IBound): IVec[] {
  const ry = Math.min(h * 0.16, 18);
  return [
    ...sampleEllipseArc(
      [x + w / 2, y + ry],
      w / 2,
      ry,
      Math.PI,
      0,
      12
    ),
    [x + w, y + h - ry],
    ...sampleEllipseArc(
      [x + w / 2, y + h - ry],
      w / 2,
      ry,
      0,
      Math.PI,
      12
    ),
    [x, y + ry],
  ];
}

function horizontalCylinderPoints({ x, y, w, h }: IBound): IVec[] {
  const rx = Math.min(w * 0.16, 18);
  const leftCenter: IVec = [x + rx, y + h / 2];
  const rightCenter: IVec = [x + w - rx, y + h / 2];
  return [
    [x + rx, y],
    [x + w - rx, y],
    ...sampleEllipseArc(
      rightCenter,
      rx,
      h / 2,
      -Math.PI / 2,
      Math.PI / 2,
      10
    ).slice(1),
    [x + rx, y + h],
    ...sampleEllipseArc(
      leftCenter,
      rx,
      h / 2,
      Math.PI / 2,
      (Math.PI * 3) / 2,
      10
    ).slice(1),
  ];
}

function documentPoints({ x, y, w, h }: IBound): IVec[] {
  const waveHeight = Math.min(h * 0.16, 18);
  const bottomStart = [x, y + h - waveHeight] as IVec;
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h - waveHeight],
    ...sampleWave(bottomStart, w, y + h - waveHeight, waveHeight, 10)
      .reverse()
      .slice(1),
  ];
}

function notePoints({ x, y, w, h }: IBound): IVec[] {
  const fold = Math.min(Math.min(w, h) * 0.22, 24);
  return [
    [x, y],
    [x + w - fold, y],
    [x + w, y + fold],
    [x + w, y + h],
    [x, y + h],
  ];
}

function packagePoints({ x, y, w, h }: IBound): IVec[] {
  const tabWidth = Math.min(w * 0.34, 72);
  const tabHeight = Math.min(h * 0.22, 22);
  return [
    [x, y],
    [x + tabWidth, y],
    [x + tabWidth, y + tabHeight],
    [x + w, y + tabHeight],
    [x + w, y + h],
    [x, y + h],
  ];
}

function cloudPoints({ x, y, w, h }: IBound): IVec[] {
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  const radiusX = w / 2;
  const radiusY = h / 2;
  const points: IVec[] = [];

  for (let index = 0; index < 18; index++) {
    const angle = (Math.PI * 2 * index) / 18;
    const scale =
      0.82 + Math.sin(angle * 5) * 0.14 + Math.cos(angle * 3) * 0.06;
    points.push([
      centerX + Math.cos(angle) * radiusX * scale,
      centerY + Math.sin(angle) * radiusY * scale,
    ]);
  }

  return points;
}

function asymmetricPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x, y],
    [x + w * 0.74, y],
    [x + w, y + h / 2],
    [x + w * 0.74, y + h],
    [x, y + h],
  ];
}

function hourglassPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x, y],
    [x + w, y],
    [x + w * 0.62, y + h / 2],
    [x + w, y + h],
    [x, y + h],
    [x + w * 0.38, y + h / 2],
  ];
}

function notchedRectPoints({ x, y, w, h }: IBound): IVec[] {
  const notch = Math.min(w * 0.12, h * 0.2, 18);
  return [
    [x, y],
    [x + w * 0.42, y],
    [x + w * 0.5, y + notch],
    [x + w * 0.58, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
}

function notchedPentagonPoints({ x, y, w, h }: IBound): IVec[] {
  const notch = Math.min(w * 0.12, 18);
  return [
    [x + w * 0.1, y + h * 0.1],
    [x + w * 0.42, y],
    [x + w * 0.5, y + notch],
    [x + w * 0.58, y],
    [x + w * 0.9, y + h * 0.1],
    [x + w, y + h * 0.55],
    [x + w * 0.5, y + h],
    [x, y + h * 0.55],
  ];
}

function boltPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x + w * 0.46, y],
    [x + w * 0.06, y + h * 0.55],
    [x + w * 0.38, y + h * 0.55],
    [x + w * 0.26, y + h],
    [x + w * 0.94, y + h * 0.38],
    [x + w * 0.56, y + h * 0.38],
  ];
}

function bangPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x + w * 0.18, y],
    [x + w * 0.82, y],
    [x + w, y + h * 0.24],
    [x + w * 0.64, y + h],
    [x + w * 0.36, y + h],
    [x, y + h * 0.24],
  ];
}

function flagPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x, y],
    [x + w * 0.72, y],
    [x + w, y + h / 2],
    [x + w * 0.72, y + h],
    [x, y + h],
  ];
}

function bowRectPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x + w * 0.16, y],
    [x + w * 0.84, y],
    [x + w, y + h / 2],
    [x + w * 0.84, y + h],
    [x + w * 0.16, y + h],
    [x, y + h / 2],
  ];
}

function taggedRectPoints({ x, y, w, h }: IBound): IVec[] {
  const tag = Math.min(w * 0.2, 24);
  return [
    [x + tag, y],
    [x + w, y],
    [x + w, y + h],
    [x + tag, y + h],
    [x, y + h / 2],
  ];
}

function taggedDocumentPoints({ x, y, w, h }: IBound): IVec[] {
  const tag = Math.min(w * 0.2, 24);
  const waveHeight = Math.min(h * 0.16, 18);
  return [
    [x + tag, y],
    [x + w, y],
    [x + w, y + h - waveHeight],
    ...sampleWave(
      [x + tag, y + h - waveHeight],
      w - tag,
      y + h - waveHeight,
      waveHeight,
      10
    )
      .reverse()
      .slice(1),
    [x, y + h / 2],
  ];
}

function braceLeftPoints({ x, y, w, h }: IBound): IVec[] {
  const t = Math.min(w * 0.28, 18);
  return [
    [x + w, y],
    [x + t, y],
    [x + t, y + h * 0.26],
    [x, y + h * 0.38],
    [x + t, y + h * 0.5],
    [x, y + h * 0.62],
    [x + t, y + h * 0.74],
    [x + t, y + h],
    [x + w, y + h],
    [x + w * 0.56, y + h * 0.74],
    [x + w * 0.38, y + h * 0.62],
    [x + w * 0.62, y + h * 0.5],
    [x + w * 0.38, y + h * 0.38],
    [x + w * 0.56, y + h * 0.26],
  ];
}

function braceRightPoints({ x, y, w, h }: IBound): IVec[] {
  return braceLeftPoints({ x, y, w, h }).map(([px, py]) => [x + w - (px - x), py]);
}

function bracesPoints({ x, y, w, h }: IBound): IVec[] {
  const left = braceLeftPoints({ x, y, w: w / 2, h });
  const right = braceRightPoints({ x: x + w / 2, y, w: w / 2, h });
  return [...left, ...right];
}

function delayPoints({ x, y, w, h }: IBound): IVec[] {
  const radius = Math.min(h / 2, w * 0.25);
  const center: IVec = [x + w - radius, y + h / 2];
  return [
    [x, y],
    [x + w - radius, y],
    ...sampleEllipseArc(center, radius, radius, -Math.PI / 2, Math.PI / 2, 10).slice(1),
    [x, y + h],
  ];
}

function curvedTrapezoidPoints({ x, y, w, h }: IBound): IVec[] {
  const curve = Math.min(h * 0.18, 18);
  return [
    [x + curve, y],
    [x + w, y],
    [x + w - curve, y + h / 2],
    [x + w, y + h],
    [x + curve, y + h],
    [x, y + h / 2],
  ];
}

function dividedRectPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
}

function windowPanePoints({ x, y, w, h }: IBound): IVec[] {
  return dividedRectPoints({ x, y, w, h });
}

function linedRectPoints({ x, y, w, h }: IBound): IVec[] {
  return dividedRectPoints({ x, y, w, h });
}

function flippedTrianglePoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x, y],
    [x + w, y],
    [x + w / 2, y + h],
  ];
}

function slopedRectPoints({ x, y, w, h }: IBound): IVec[] {
  const slope = w * 0.14;
  return [
    [x + slope, y],
    [x + w, y],
    [x + w - slope, y + h],
    [x, y + h],
  ];
}

function stackedRectPoints({ x, y, w, h }: IBound): IVec[] {
  return dividedRectPoints({ x, y, w, h });
}

function oddPoints({ x, y, w, h }: IBound): IVec[] {
  return [
    [x + w * 0.18, y],
    [x + w * 0.78, y],
    [x + w, y + h * 0.26],
    [x + w * 0.82, y + h],
    [x + w * 0.18, y + h],
    [x, y + h * 0.62],
    [x, y + h * 0.22],
  ];
}

export const hexagon = createShapeMethod(hexagonPoints, traceFromPoints(hexagonPoints));
export const pentagon = createShapeMethod(pentagonPoints, traceFromPoints(pentagonPoints));
export const octagon = createShapeMethod(octagonPoints, traceFromPoints(octagonPoints));
export const parallelogram = createShapeMethod(
  parallelogramPoints,
  traceFromPoints(parallelogramPoints)
);
export const leanLeft = createShapeMethod(leanLeftPoints, traceFromPoints(leanLeftPoints));
export const trapezoid = createShapeMethod(trapezoidPoints, traceFromPoints(trapezoidPoints));
export const trapezoidAlt = createShapeMethod(
  trapezoidAltPoints,
  traceFromPoints(trapezoidAltPoints)
);
export const stadium = createShapeMethod(stadiumPoints, traceFromPoints(stadiumPoints));
export const subroutine = createShapeMethod(dividedRectPoints, traceFromPoints(dividedRectPoints));
export const cylinder = createShapeMethod(cylinderPoints, traceFromPoints(cylinderPoints));
export const horizontalCylinder = createShapeMethod(
  horizontalCylinderPoints,
  traceFromPoints(horizontalCylinderPoints)
);
export const linedCylinder = createShapeMethod(cylinderPoints, traceFromPoints(cylinderPoints));
export const document = createShapeMethod(documentPoints, traceFromPoints(documentPoints));
export const linedDocument = createShapeMethod(
  documentPoints,
  traceFromPoints(documentPoints)
);
export const multiDocument = createShapeMethod(
  documentPoints,
  traceFromPoints(documentPoints)
);
export const note = createShapeMethod(notePoints, traceFromPoints(notePoints));
export const packageShape = createShapeMethod(packagePoints, traceFromPoints(packagePoints));
export const cloud = createShapeMethod(cloudPoints, traceFromPoints(cloudPoints));
export const doubleCircle = createShapeMethod(
  bound => ellipsePoints(bound),
  traceFromPoints(bound => ellipsePoints(bound))
);
export const filledCircle = createShapeMethod(
  bound => ellipsePoints(bound),
  traceFromPoints(bound => ellipsePoints(bound))
);
export const asymmetric = createShapeMethod(
  asymmetricPoints,
  traceFromPoints(asymmetricPoints)
);
export const hourglass = createShapeMethod(hourglassPoints, traceFromPoints(hourglassPoints));
export const notchedRect = createShapeMethod(
  notchedRectPoints,
  traceFromPoints(notchedRectPoints)
);
export const notchedPentagon = createShapeMethod(
  notchedPentagonPoints,
  traceFromPoints(notchedPentagonPoints)
);
export const bolt = createShapeMethod(boltPoints, traceFromPoints(boltPoints));
export const bang = createShapeMethod(bangPoints, traceFromPoints(bangPoints));
export const flag = createShapeMethod(flagPoints, traceFromPoints(flagPoints));
export const bowRect = createShapeMethod(bowRectPoints, traceFromPoints(bowRectPoints));
export const smallCircle = createShapeMethod(
  bound => ellipsePoints(bound),
  traceFromPoints(bound => ellipsePoints(bound))
);
export const framedCircle = createShapeMethod(
  bound => ellipsePoints(bound),
  traceFromPoints(bound => ellipsePoints(bound))
);
export const crossedCircle = createShapeMethod(
  bound => ellipsePoints(bound),
  traceFromPoints(bound => ellipsePoints(bound))
);
export const taggedDocument = createShapeMethod(
  taggedDocumentPoints,
  traceFromPoints(taggedDocumentPoints)
);
export const taggedRect = createShapeMethod(
  taggedRectPoints,
  traceFromPoints(taggedRectPoints)
);
export const braceLeft = createShapeMethod(
  braceLeftPoints,
  traceFromPoints(braceLeftPoints)
);
export const braceRight = createShapeMethod(
  braceRightPoints,
  traceFromPoints(braceRightPoints)
);
export const braces = createShapeMethod(bracesPoints, traceFromPoints(bracesPoints));
export const delay = createShapeMethod(delayPoints, traceFromPoints(delayPoints));
export const curvedTrapezoid = createShapeMethod(
  curvedTrapezoidPoints,
  traceFromPoints(curvedTrapezoidPoints)
);
export const dividedRect = createShapeMethod(
  dividedRectPoints,
  traceFromPoints(dividedRectPoints)
);
export const forkJoin = createShapeMethod(dividedRectPoints, traceFromPoints(dividedRectPoints));
export const windowPane = createShapeMethod(
  windowPanePoints,
  traceFromPoints(windowPanePoints)
);
export const linedRect = createShapeMethod(
  linedRectPoints,
  traceFromPoints(linedRectPoints)
);
export const flippedTriangle = createShapeMethod(
  flippedTrianglePoints,
  traceFromPoints(flippedTrianglePoints)
);
export const slopedRect = createShapeMethod(
  slopedRectPoints,
  traceFromPoints(slopedRectPoints)
);
export const stackedRect = createShapeMethod(
  stackedRectPoints,
  traceFromPoints(stackedRectPoints)
);
export const odd = createShapeMethod(oddPoints, traceFromPoints(oddPoints));

export const presetShapeMethods = {
  [ShapeType.Hexagon]: hexagon,
  [ShapeType.Pentagon]: pentagon,
  [ShapeType.Octagon]: octagon,
  [ShapeType.Parallelogram]: parallelogram,
  [ShapeType.LeanLeft]: leanLeft,
  [ShapeType.Trapezoid]: trapezoid,
  [ShapeType.TrapezoidAlt]: trapezoidAlt,
  [ShapeType.Stadium]: stadium,
  [ShapeType.Subroutine]: subroutine,
  [ShapeType.Cylinder]: cylinder,
  [ShapeType.HorizontalCylinder]: horizontalCylinder,
  [ShapeType.LinedCylinder]: linedCylinder,
  [ShapeType.Document]: document,
  [ShapeType.LinedDocument]: linedDocument,
  [ShapeType.MultiDocument]: multiDocument,
  [ShapeType.Note]: note,
  [ShapeType.Package]: packageShape,
  [ShapeType.Cloud]: cloud,
  [ShapeType.DoubleCircle]: doubleCircle,
  [ShapeType.FilledCircle]: filledCircle,
  [ShapeType.Asymmetric]: asymmetric,
  [ShapeType.Hourglass]: hourglass,
  [ShapeType.NotchedRect]: notchedRect,
  [ShapeType.NotchedPentagon]: notchedPentagon,
  [ShapeType.Bolt]: bolt,
  [ShapeType.Bang]: bang,
  [ShapeType.Flag]: flag,
  [ShapeType.BowRect]: bowRect,
  [ShapeType.SmallCircle]: smallCircle,
  [ShapeType.FramedCircle]: framedCircle,
  [ShapeType.CrossedCircle]: crossedCircle,
  [ShapeType.TaggedDocument]: taggedDocument,
  [ShapeType.TaggedRect]: taggedRect,
  [ShapeType.BraceLeft]: braceLeft,
  [ShapeType.BraceRight]: braceRight,
  [ShapeType.Braces]: braces,
  [ShapeType.Delay]: delay,
  [ShapeType.CurvedTrapezoid]: curvedTrapezoid,
  [ShapeType.DividedRect]: dividedRect,
  [ShapeType.ForkJoin]: forkJoin,
  [ShapeType.WindowPane]: windowPane,
  [ShapeType.LinedRect]: linedRect,
  [ShapeType.FlippedTriangle]: flippedTriangle,
  [ShapeType.SlopedRect]: slopedRect,
  [ShapeType.StackedRect]: stackedRect,
  [ShapeType.Odd]: odd,
};
