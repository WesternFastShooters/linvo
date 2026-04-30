export type MermaidDiagramType =
  | 'flowchart'
  | 'pie'
  | 'sequence'
  | 'class'
  | 'unknown';

export type MermaidRenderResult = {
  code: string;
  svg: string;
  width: number;
  height: number;
  diagramType: MermaidDiagramType;
};

export type MermaidPreviewModel = {
  mode: 'native' | 'image';
  svg: string;
  width: number;
  height: number;
};

export type NativeNodeShape =
  | 'rect'
  | 'roundedRect'
  | 'triangle'
  | 'diamond'
  | 'ellipse'
  | 'hexagon'
  | 'pentagon'
  | 'octagon'
  | 'parallelogram'
  | 'leanLeft'
  | 'trapezoid'
  | 'trapezoidAlt'
  | 'stadium'
  | 'subroutine'
  | 'cylinder'
  | 'horizontalCylinder'
  | 'linedCylinder'
  | 'document'
  | 'linedDocument'
  | 'multiDocument'
  | 'note'
  | 'package'
  | 'cloud'
  | 'doubleCircle'
  | 'filledCircle'
  | 'asymmetric'
  | 'hourglass'
  | 'notchedRect'
  | 'notchedPentagon'
  | 'bolt'
  | 'bang'
  | 'flag'
  | 'bowRect'
  | 'smallCircle'
  | 'framedCircle'
  | 'crossedCircle'
  | 'taggedDocument'
  | 'taggedRect'
  | 'braceLeft'
  | 'braceRight'
  | 'braces'
  | 'delay'
  | 'curvedTrapezoid'
  | 'dividedRect'
  | 'forkJoin'
  | 'windowPane'
  | 'linedRect'
  | 'flippedTriangle'
  | 'slopedRect'
  | 'stackedRect'
  | 'odd';

export type NativeNodePlan = {
  id: string;
  label: string;
  shapeType: NativeNodeShape;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type NativeEdgePlan = {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  direction: 'left' | 'right' | 'top' | 'bottom';
};

export type MermaidInsertPlan =
  | {
      kind: 'native';
      width: number;
      height: number;
      nodes: NativeNodePlan[];
      edges: NativeEdgePlan[];
    }
  | {
      kind: 'image';
      width: number;
      height: number;
      svg: string;
      diagramType: MermaidDiagramType;
    };
