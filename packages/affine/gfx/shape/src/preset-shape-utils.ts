import type { Options, RoughCanvas } from '@blocksuite/affine-block-surface';
import { shapeMethods, ShapeType } from '@blocksuite/affine-model';
import { Bound, type IVec, type XYWH } from '@blocksuite/global/gfx';

export const PRESET_SHAPE_TYPES = [
  ShapeType.Hexagon,
  ShapeType.Pentagon,
  ShapeType.Octagon,
  ShapeType.Parallelogram,
  ShapeType.LeanLeft,
  ShapeType.Trapezoid,
  ShapeType.TrapezoidAlt,
  ShapeType.Stadium,
  ShapeType.Subroutine,
  ShapeType.Cylinder,
  ShapeType.HorizontalCylinder,
  ShapeType.LinedCylinder,
  ShapeType.Document,
  ShapeType.LinedDocument,
  ShapeType.MultiDocument,
  ShapeType.Note,
  ShapeType.Package,
  ShapeType.Cloud,
  ShapeType.DoubleCircle,
  ShapeType.FilledCircle,
  ShapeType.Asymmetric,
  ShapeType.Hourglass,
  ShapeType.NotchedRect,
  ShapeType.NotchedPentagon,
  ShapeType.Bolt,
  ShapeType.Bang,
  ShapeType.Flag,
  ShapeType.BowRect,
  ShapeType.SmallCircle,
  ShapeType.FramedCircle,
  ShapeType.CrossedCircle,
  ShapeType.TaggedDocument,
  ShapeType.TaggedRect,
  ShapeType.BraceLeft,
  ShapeType.BraceRight,
  ShapeType.Braces,
  ShapeType.Delay,
  ShapeType.CurvedTrapezoid,
  ShapeType.DividedRect,
  ShapeType.ForkJoin,
  ShapeType.WindowPane,
  ShapeType.LinedRect,
  ShapeType.FlippedTriangle,
  ShapeType.SlopedRect,
  ShapeType.StackedRect,
  ShapeType.Odd,
] as const;

export type PresetShapeType = (typeof PRESET_SHAPE_TYPES)[number];

export function isPresetShapeType(type: string): type is PresetShapeType {
  return (PRESET_SHAPE_TYPES as readonly string[]).includes(type);
}

function getRenderBound(xywh: XYWH, strokeWidth = 0) {
  const [x, y, w, h] = xywh;
  const inset = Math.max(strokeWidth, 0) / 2;
  return new Bound(
    x + inset,
    y + inset,
    Math.max(1, w - inset * 2),
    Math.max(1, h - inset * 2)
  );
}

export function getPresetShapePoints(
  type: PresetShapeType,
  xywh: XYWH,
  strokeWidth = 0
): IVec[] {
  return shapeMethods[type].points(getRenderBound(xywh, strokeWidth));
}

export function pointsToSvgPath(points: IVec[]) {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first[0]} ${first[1]} ${rest
    .map(point => `L ${point[0]} ${point[1]}`)
    .join(' ')} Z`;
}

function getSubroutineLines(bound: Bound): [IVec, IVec][] {
  const inset = Math.min(bound.w * 0.14, 18);
  return [
    [
      [bound.x + inset, bound.y],
      [bound.x + inset, bound.y + bound.h],
    ],
    [
      [bound.x + bound.w - inset, bound.y],
      [bound.x + bound.w - inset, bound.y + bound.h],
    ],
  ];
}

function getNoteLines(bound: Bound): [IVec, IVec][] {
  const fold = Math.min(Math.min(bound.w, bound.h) * 0.22, 24);
  const innerX = bound.x + bound.w - fold;
  return [
    [
      [innerX, bound.y],
      [innerX, bound.y + fold],
    ],
    [
      [innerX, bound.y + fold],
      [bound.x + bound.w, bound.y + fold],
    ],
  ];
}

function getLinedRectLines(bound: Bound): [IVec, IVec][] {
  const top = bound.y + Math.min(bound.h * 0.24, 20);
  return [[[bound.x + 8, top], [bound.x + bound.w - 8, top]]];
}

function getDividedRectLines(bound: Bound): [IVec, IVec][] {
  const dividerX = bound.x + Math.min(bound.w * 0.28, 28);
  return [[[dividerX, bound.y], [dividerX, bound.y + bound.h]]];
}

function getWindowPaneLines(bound: Bound): [IVec, IVec][] {
  return [
    [
      [bound.x + bound.w / 2, bound.y],
      [bound.x + bound.w / 2, bound.y + bound.h],
    ],
    [
      [bound.x, bound.y + bound.h / 2],
      [bound.x + bound.w, bound.y + bound.h / 2],
    ],
  ];
}

function getInnerEllipse(bound: Bound, scale = 0.72) {
  return {
    cx: bound.x + bound.w / 2,
    cy: bound.y + bound.h / 2,
    rx: (bound.w / 2) * scale,
    ry: (bound.h / 2) * scale,
  };
}

function getCrossLines(bound: Bound): [IVec, IVec][] {
  const inset = Math.min(Math.min(bound.w, bound.h) * 0.24, 18);
  return [
    [
      [bound.x + inset, bound.y + inset],
      [bound.x + bound.w - inset, bound.y + bound.h - inset],
    ],
    [
      [bound.x + bound.w - inset, bound.y + inset],
      [bound.x + inset, bound.y + bound.h - inset],
    ],
  ];
}

function getBangLines(bound: Bound): [IVec, IVec][] {
  const centerX = bound.x + bound.w / 2;
  return [
    [
      [centerX, bound.y + bound.h * 0.2],
      [centerX, bound.y + bound.h * 0.62],
    ],
  ];
}

function getTagHole(bound: Bound) {
  const radius = Math.min(bound.w * 0.07, bound.h * 0.14, 7);
  return {
    cx: bound.x + radius * 2.2,
    cy: bound.y + bound.h / 2,
    rx: radius,
    ry: radius,
  };
}

function getHorizontalCylinderInnerArc(bound: Bound): [IVec, IVec][] {
  const inset = Math.min(bound.w * 0.16, 18);
  return [
    [
      [bound.x + inset, bound.y],
      [bound.x + inset, bound.y + bound.h],
    ],
  ];
}

function getCylinderEllipse(bound: Bound) {
  const ry = Math.min(bound.h * 0.16, 18);
  return {
    cx: bound.x + bound.w / 2,
    cy: bound.y + ry,
    rx: bound.w / 2,
    ry,
  };
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: [IVec, IVec][]
) {
  if (!lines.length) return;
  ctx.beginPath();
  for (const [start, end] of lines) {
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
  }
  ctx.stroke();
}

function drawRoughLines(
  rc: RoughCanvas,
  lines: [IVec, IVec][],
  options: Options
) {
  for (const [start, end] of lines) {
    rc.line(start[0], start[1], end[0], end[1], options);
  }
}

export function drawPresetShapeUnderlay(
  ctx: CanvasRenderingContext2D,
  type: PresetShapeType,
  xywh: XYWH,
  strokeWidth = 0
) {
  const [x, y, w, h] = xywh;
  if (type === ShapeType.MultiDocument) {
    shapeMethods.document.draw(
      ctx,
      getRenderBound([x - 12, y - 10, w, h], strokeWidth)
    );
    ctx.stroke();
    shapeMethods.document.draw(
      ctx,
      getRenderBound([x - 6, y - 5, w, h], strokeWidth)
    );
    ctx.stroke();
  }

  if (type === ShapeType.StackedRect) {
    for (const [dx, dy] of [
      [-12, -10],
      [-6, -5],
    ]) {
      shapeMethods.rect.draw(ctx, getRenderBound([x + dx, y + dy, w, h], strokeWidth));
      ctx.stroke();
    }
  }
}

export function drawPresetShapeUnderlayRough(
  rc: RoughCanvas,
  type: PresetShapeType,
  xywh: XYWH,
  options: Options
) {
  const [x, y, w, h] = xywh;
  if (type === ShapeType.MultiDocument) {
    rc.polygon(
      getPresetShapePoints(ShapeType.Document, [x - 12, y - 10, w, h]),
      {
        ...options,
        fill: undefined,
      }
    );
    rc.polygon(getPresetShapePoints(ShapeType.Document, [x - 6, y - 5, w, h]), {
      ...options,
      fill: undefined,
    });
  }

  if (type === ShapeType.StackedRect) {
    for (const [dx, dy] of [
      [-12, -10],
      [-6, -5],
    ]) {
      rc.polygon(
        shapeMethods.rect.points(getRenderBound([x + dx, y + dy, w, h])),
        {
          ...options,
          fill: undefined,
        }
      );
    }
  }
}

export function drawPresetShapeOverlay(
  ctx: CanvasRenderingContext2D,
  type: PresetShapeType,
  xywh: XYWH,
  strokeWidth = 0
) {
  const bound = getRenderBound(xywh, strokeWidth);

  switch (type) {
    case ShapeType.Subroutine:
      drawLines(ctx, getSubroutineLines(bound));
      break;
    case ShapeType.Cylinder: {
      const { cx, cy, rx, ry } = getCylinderEllipse(bound);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case ShapeType.HorizontalCylinder:
      drawLines(ctx, getHorizontalCylinderInnerArc(bound));
      break;
    case ShapeType.LinedCylinder: {
      const { cx, cy, rx, ry } = getCylinderEllipse(bound);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      drawLines(ctx, getLinedRectLines(bound));
      break;
    }
    case ShapeType.DoubleCircle: {
      const { cx, cy, rx, ry } = getInnerEllipse(bound);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case ShapeType.FramedCircle: {
      const { cx, cy, rx, ry } = getInnerEllipse(bound, 0.84);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case ShapeType.CrossedCircle:
      drawLines(ctx, getCrossLines(bound));
      break;
    case ShapeType.Note:
      drawLines(ctx, getNoteLines(bound));
      break;
    case ShapeType.Bang: {
      drawLines(ctx, getBangLines(bound));
      const radius = Math.min(bound.w * 0.04, bound.h * 0.06, 4);
      ctx.beginPath();
      ctx.ellipse(
        bound.x + bound.w / 2,
        bound.y + bound.h * 0.78,
        radius,
        radius,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      break;
    }
    case ShapeType.TaggedDocument:
    case ShapeType.TaggedRect: {
      const { cx, cy, rx, ry } = getTagHole(bound);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case ShapeType.LinedDocument:
    case ShapeType.LinedRect:
      drawLines(ctx, getLinedRectLines(bound));
      break;
    case ShapeType.DividedRect:
      drawLines(ctx, getDividedRectLines(bound));
      break;
    case ShapeType.WindowPane:
      drawLines(ctx, getWindowPaneLines(bound));
      break;
  }
}

export function drawPresetShapeOverlayRough(
  rc: RoughCanvas,
  type: PresetShapeType,
  xywh: XYWH,
  options: Options
) {
  const bound = getRenderBound(xywh, options.strokeWidth ?? 0);

  switch (type) {
    case ShapeType.Subroutine:
      drawRoughLines(rc, getSubroutineLines(bound), options);
      break;
    case ShapeType.Cylinder: {
      const { cx, cy, rx, ry } = getCylinderEllipse(bound);
      rc.ellipse(cx, cy, rx * 2, ry * 2, {
        ...options,
        fill: undefined,
      });
      break;
    }
    case ShapeType.HorizontalCylinder:
      drawRoughLines(rc, getHorizontalCylinderInnerArc(bound), options);
      break;
    case ShapeType.LinedCylinder: {
      const { cx, cy, rx, ry } = getCylinderEllipse(bound);
      rc.ellipse(cx, cy, rx * 2, ry * 2, {
        ...options,
        fill: undefined,
      });
      drawRoughLines(rc, getLinedRectLines(bound), options);
      break;
    }
    case ShapeType.DoubleCircle: {
      const { cx, cy, rx, ry } = getInnerEllipse(bound);
      rc.ellipse(cx, cy, rx * 2, ry * 2, {
        ...options,
        fill: undefined,
      });
      break;
    }
    case ShapeType.FramedCircle: {
      const { cx, cy, rx, ry } = getInnerEllipse(bound, 0.84);
      rc.ellipse(cx, cy, rx * 2, ry * 2, {
        ...options,
        fill: undefined,
      });
      break;
    }
    case ShapeType.CrossedCircle:
      drawRoughLines(rc, getCrossLines(bound), options);
      break;
    case ShapeType.Note:
      drawRoughLines(rc, getNoteLines(bound), options);
      break;
    case ShapeType.Bang: {
      drawRoughLines(rc, getBangLines(bound), options);
      const radius = Math.min(bound.w * 0.08, bound.h * 0.12, 8);
      rc.circle(bound.x + bound.w / 2, bound.y + bound.h * 0.78, radius, {
        ...options,
        fill: options.stroke ?? undefined,
      });
      break;
    }
    case ShapeType.TaggedDocument:
    case ShapeType.TaggedRect: {
      const { cx, cy, rx } = getTagHole(bound);
      rc.circle(cx, cy, rx * 2, {
        ...options,
        fill: undefined,
      });
      break;
    }
    case ShapeType.LinedDocument:
    case ShapeType.LinedRect:
      drawRoughLines(rc, getLinedRectLines(bound), options);
      break;
    case ShapeType.DividedRect:
      drawRoughLines(rc, getDividedRectLines(bound), options);
      break;
    case ShapeType.WindowPane:
      drawRoughLines(rc, getWindowPaneLines(bound), options);
      break;
  }
}
