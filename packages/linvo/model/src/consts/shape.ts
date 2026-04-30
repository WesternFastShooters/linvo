export const DEFAULT_ROUGHNESS = 1.4;

// TODO: need to check the default central area ratio
export const DEFAULT_CENTRAL_AREA_RATIO = 0.3;

export enum ShapeTextFontSize {
  LARGE = 28,
  MEDIUM = 20,
  SMALL = 12,
  XLARGE = 36,
}

export enum ShapeType {
  Rect = 'rect',
  Ellipse = 'ellipse',
  Diamond = 'diamond',
  Triangle = 'triangle',
  Hexagon = 'hexagon',
  Pentagon = 'pentagon',
  Octagon = 'octagon',
  Parallelogram = 'parallelogram',
  LeanLeft = 'leanLeft',
  Trapezoid = 'trapezoid',
  TrapezoidAlt = 'trapezoidAlt',
  Stadium = 'stadium',
  Subroutine = 'subroutine',
  Cylinder = 'cylinder',
  HorizontalCylinder = 'horizontalCylinder',
  LinedCylinder = 'linedCylinder',
  Document = 'document',
  LinedDocument = 'linedDocument',
  MultiDocument = 'multiDocument',
  Note = 'note',
  Package = 'package',
  Cloud = 'cloud',
  DoubleCircle = 'doubleCircle',
  FilledCircle = 'filledCircle',
  Asymmetric = 'asymmetric',
  Hourglass = 'hourglass',
  NotchedRect = 'notchedRect',
  NotchedPentagon = 'notchedPentagon',
  Bolt = 'bolt',
  Bang = 'bang',
  Flag = 'flag',
  BowRect = 'bowRect',
  SmallCircle = 'smallCircle',
  FramedCircle = 'framedCircle',
  CrossedCircle = 'crossedCircle',
  TaggedDocument = 'taggedDocument',
  TaggedRect = 'taggedRect',
  BraceLeft = 'braceLeft',
  BraceRight = 'braceRight',
  Braces = 'braces',
  Delay = 'delay',
  CurvedTrapezoid = 'curvedTrapezoid',
  DividedRect = 'dividedRect',
  ForkJoin = 'forkJoin',
  WindowPane = 'windowPane',
  LinedRect = 'linedRect',
  FlippedTriangle = 'flippedTriangle',
  SlopedRect = 'slopedRect',
  StackedRect = 'stackedRect',
  Odd = 'odd',
}

export type ShapeName = ShapeType | 'roundedRect';

export function getShapeName(type: ShapeType, radius: number): ShapeName {
  if (type === ShapeType.Rect && radius > 0) {
    return 'roundedRect';
  }
  return type;
}

export function getShapeType(name: ShapeName): ShapeType {
  if (name === 'roundedRect') {
    return ShapeType.Rect;
  }
  return name;
}

export function getShapeRadius(name: ShapeName): number {
  if (name === 'roundedRect') {
    return 0.1;
  }
  return 0;
}

export enum ShapeStyle {
  General = 'General',
  Scribbled = 'Scribbled',
}
