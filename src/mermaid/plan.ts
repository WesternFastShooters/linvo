import type {
  MermaidInsertPlan,
  MermaidRenderResult,
  NativeEdgePlan,
  NativeNodePlan,
  NativeNodeShape,
} from './types';

type ParsedNode = {
  id: string;
  label: string;
  shapeType: NativeNodeShape;
};

type ParsedEdge = {
  sourceId: string;
  targetId: string;
  label?: string;
};

type ParsedFlowchart = {
  direction: 'TB' | 'TD' | 'BT' | 'LR' | 'RL';
  nodes: Map<string, ParsedNode>;
  edges: ParsedEdge[];
};

const shapeAliasMap: Record<string, NativeNodeShape> = {
  process: 'rect',
  rect: 'rect',
  proc: 'rect',
  round: 'roundedRect',
  rounded: 'roundedRect',
  roundedrect: 'roundedRect',
  event: 'roundedRect',
  triangle: 'triangle',
  tri: 'triangle',
  extract: 'triangle',
  diamond: 'diamond',
  decision: 'diamond',
  diam: 'diamond',
  rhombus: 'diamond',
  ellipse: 'ellipse',
  circle: 'ellipse',
  circ: 'ellipse',
  hexagon: 'hexagon',
  hex: 'hexagon',
  prepare: 'hexagon',
  pentagon: 'pentagon',
  octagon: 'octagon',
  parallelogram: 'parallelogram',
  leanright: 'parallelogram',
  leanr: 'parallelogram',
  leanleft: 'leanLeft',
  leanl: 'leanLeft',
  trapezoid: 'trapezoid',
  manualoperation: 'trapezoid',
  trapb: 'trapezoid',
  trapezoidalt: 'trapezoidAlt',
  invtrapezoid: 'trapezoidAlt',
  trapt: 'trapezoidAlt',
  stadium: 'stadium',
  terminal: 'stadium',
  terminator: 'stadium',
  subroutine: 'subroutine',
  subprocess: 'subroutine',
  subproc: 'subroutine',
  framedrect: 'subroutine',
  strect: 'subroutine',
  cyl: 'cylinder',
  cylinder: 'cylinder',
  database: 'cylinder',
  db: 'cylinder',
  horizontalcylinder: 'horizontalCylinder',
  hcyl: 'horizontalCylinder',
  diskstorage: 'horizontalCylinder',
  disk: 'horizontalCylinder',
  linedcylinder: 'linedCylinder',
  lincyl: 'linedCylinder',
  storage: 'linedCylinder',
  doc: 'document',
  document: 'document',
  lineddocument: 'linedDocument',
  lineddoc: 'linedDocument',
  docs: 'multiDocument',
  multidocument: 'multiDocument',
  documents: 'multiDocument',
  note: 'note',
  package: 'package',
  cloud: 'cloud',
  doublecircle: 'doubleCircle',
  dblcirc: 'doubleCircle',
  stop: 'doubleCircle',
  filledcircle: 'filledCircle',
  junction: 'filledCircle',
  smallcircle: 'smallCircle',
  smcirc: 'smallCircle',
  start: 'smallCircle',
  framedcircle: 'framedCircle',
  frcirc: 'framedCircle',
  crossedcircle: 'crossedCircle',
  crosscirc: 'crossedCircle',
  summary: 'crossedCircle',
  asymmetric: 'asymmetric',
  hourglass: 'hourglass',
  collate: 'hourglass',
  notchedrect: 'notchedRect',
  card: 'notchedRect',
  notchedpentagon: 'notchedPentagon',
  looplimit: 'notchedPentagon',
  bolt: 'bolt',
  comlink: 'bolt',
  communicationlink: 'bolt',
  lightningbolt: 'bolt',
  bang: 'bang',
  flag: 'flag',
  papertape: 'flag',
  bowrect: 'bowRect',
  storeddata: 'bowRect',
  taggeddocument: 'taggedDocument',
  tagdocument: 'taggedDocument',
  tagdoc: 'taggedDocument',
  taggedrect: 'taggedRect',
  tagrect: 'taggedRect',
  braceleft: 'braceLeft',
  braceright: 'braceRight',
  braces: 'braces',
  delay: 'delay',
  hcorr: 'delay',
  hcil: 'horizontalCylinder',
  curvedtrapezoid: 'curvedTrapezoid',
  display: 'curvedTrapezoid',
  dividedrect: 'dividedRect',
  divrect: 'dividedRect',
  dividedprocess: 'dividedRect',
  divproc: 'dividedRect',
  forkjoin: 'forkJoin',
  fork: 'forkJoin',
  join: 'forkJoin',
  filledrect: 'forkJoin',
  windowpane: 'windowPane',
  internalstorage: 'windowPane',
  linedrect: 'linedRect',
  linedprocess: 'linedRect',
  linproc: 'linedRect',
  shadedprocess: 'linedRect',
  flippedtriangle: 'flippedTriangle',
  manualfile: 'flippedTriangle',
  slopedrect: 'slopedRect',
  manualinput: 'slopedRect',
  stackedrect: 'stackedRect',
  multiprocess: 'stackedRect',
  odd: 'odd',
};

function stripQuotes(label: string) {
  const trimmed = label.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function resolveShapeAlias(value: string): NativeNodeShape | null {
  return shapeAliasMap[value.toLowerCase().replace(/[^a-z]/g, '')] ?? null;
}

function parseLegacyShape(shape: string): Pick<ParsedNode, 'label' | 'shapeType'> | null {
  const patterns: Array<[RegExp, NativeNodeShape]> = [
    [/^\(\((.+)\)\)$/s, 'ellipse'],
    [/^\(\(\((.+)\)\)\)$/s, 'doubleCircle'],
    [/^\(\[(.+)\]\)$/s, 'stadium'],
    [/^\[\((.+)\)\]$/s, 'cylinder'],
    [/^\[\[(.+)\]\]$/s, 'subroutine'],
    [/^\{\{(.+)\}\}$/s, 'hexagon'],
    [/^\[\/(.+)\/\]$/s, 'parallelogram'],
    [/^\[\\(.+)\\\]$/s, 'parallelogram'],
    [/^\[\/(.+)\\\]$/s, 'trapezoid'],
    [/^\[\\(.+)\/\]$/s, 'trapezoidAlt'],
    [/^\((.+)\)$/s, 'roundedRect'],
    [/^\[(.+)\]$/s, 'rect'],
    [/^\{(.+)\}$/s, 'diamond'],
  ];

  for (const [pattern, shapeType] of patterns) {
    const matched = shape.match(pattern);
    if (matched) {
      return {
        label: stripQuotes(matched[1] ?? ''),
        shapeType,
      };
    }
  }

  return null;
}

function parseNodeToken(token: string): ParsedNode | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  if (trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('fa:')) {
    return null;
  }

  const match = trimmed.match(/^([A-Za-z0-9_:-]+)(.*)$/);
  if (!match) return null;

  const [, id, rawShape = ''] = match;
  let shape = rawShape.trim();
  if (!shape) {
    return { id, label: id, shapeType: 'rect' };
  }

  if (shape.startsWith('@{')) {
    const attrEnd = shape.indexOf('}');
    if (attrEnd < 0) return null;

    const attrSource = shape.slice(2, attrEnd);
    const tail = shape.slice(attrEnd + 1).trim();
    const shapeMatch = attrSource.match(/shape\s*:\s*["']?([A-Za-z0-9_-]+)["']?/i);
    const labelMatch = attrSource.match(/label\s*:\s*("([^"]*)"|'([^']*)')/i);
    const shapeType = shapeMatch?.[1] ? resolveShapeAlias(shapeMatch[1]) : null;

    if (!shapeType) return null;

    const legacy = tail ? parseLegacyShape(tail) : null;
    return {
      id,
      label:
        stripQuotes(
          (labelMatch?.[2] ?? labelMatch?.[3] ?? legacy?.label ?? id) as string
        ) || id,
      shapeType,
    };
  }

  const legacy = parseLegacyShape(shape);
  if (legacy) {
    return {
      id,
      label: legacy.label || id,
      shapeType: legacy.shapeType,
    };
  }

  return null;
}

function parseFlowchart(code: string): ParsedFlowchart | null {
  const lines = code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('%%'));

  if (lines.length === 0) return null;

  const header = lines[0]!.match(/^(flowchart|graph)\s+(TB|TD|BT|LR|RL)$/i);
  if (!header) return null;

  const direction = header[2]!.toUpperCase() as ParsedFlowchart['direction'];
  const nodes = new Map<string, ParsedNode>();
  const edges: ParsedEdge[] = [];

  for (const line of lines.slice(1)) {
    if (line.startsWith('subgraph') || line === 'end') {
      return null;
    }

    const edgeMatch = line.match(/^(.*?)\s*-->\s*(?:\|([^|]+)\|\s*)?(.*?)$/);
    if (!edgeMatch) {
      return null;
    }

    const source = parseNodeToken(edgeMatch[1] ?? '');
    const target = parseNodeToken(edgeMatch[3] ?? '');
    if (!source || !target) return null;

    nodes.set(source.id, source);
    nodes.set(target.id, target);
    edges.push({
      sourceId: source.id,
      targetId: target.id,
      label: edgeMatch[2]?.trim() || undefined,
    });
  }

  return { direction, nodes, edges };
}

function layoutFlowchart(parsed: ParsedFlowchart): MermaidInsertPlan | null {
  const nodeIds = [...parsed.nodes.keys()];
  const level = new Map<string, number>(nodeIds.map(id => [id, 0]));
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, number>(nodeIds.map(id => [id, 0]));

  for (const id of nodeIds) {
    outgoing.set(id, []);
  }
  for (const edge of parsed.edges) {
    outgoing.get(edge.sourceId)?.push(edge.targetId);
    incoming.set(edge.targetId, (incoming.get(edge.targetId) ?? 0) + 1);
  }

  const queue = nodeIds.filter(id => (incoming.get(id) ?? 0) === 0);
  if (queue.length === 0 && nodeIds[0]) {
    queue.push(nodeIds[0]);
  }

  const visited = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const currentLevel = level.get(current) ?? 0;
    for (const targetId of outgoing.get(current) ?? []) {
      if (!visited.has(targetId)) {
        level.set(targetId, Math.max(level.get(targetId) ?? 0, currentLevel + 1));
        queue.push(targetId);
      }
    }
  }

  for (const id of nodeIds) {
    if (visited.has(id)) continue;
    queue.push(id);
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const currentLevel = level.get(current) ?? 0;
      for (const targetId of outgoing.get(current) ?? []) {
        if (!visited.has(targetId)) {
          level.set(
            targetId,
            Math.max(level.get(targetId) ?? 0, currentLevel + 1)
          );
          queue.push(targetId);
        }
      }
    }
  }

  const grouped = new Map<number, string[]>();
  for (const id of nodeIds) {
    const value = level.get(id) ?? 0;
    grouped.set(value, [...(grouped.get(value) ?? []), id]);
  }

  const isHorizontal =
    parsed.direction === 'LR' || parsed.direction === 'RL';
  const maxLevel = Math.max(...grouped.keys());
  const columnGap = 220;
  const rowGap = 140;

  const nodes: NativeNodePlan[] = nodeIds.map(id => {
    const node = parsed.nodes.get(id)!;
    const layer = level.get(id) ?? 0;
    const layerIds = grouped.get(layer) ?? [];
    const offset = layerIds.indexOf(id);
    const width = Math.max(120, Math.min(220, node.label.length * 9 + 40));
    const height = 72;

    let x = isHorizontal ? layer * columnGap : offset * columnGap;
    let y = isHorizontal ? offset * rowGap : layer * rowGap;

    if (parsed.direction === 'RL') {
      x = (maxLevel - layer) * columnGap;
    }
    if (parsed.direction === 'BT') {
      y = (maxLevel - layer) * rowGap;
    }

    return {
      id: node.id,
      label: node.label,
      shapeType: node.shapeType,
      x,
      y,
      width,
      height,
    };
  });

  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const edges: NativeEdgePlan[] = parsed.edges.map((edge, index) => {
    const source = nodeById.get(edge.sourceId)!;
    const target = nodeById.get(edge.targetId)!;
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const direction =
      Math.abs(dx) >= Math.abs(dy)
        ? dx >= 0
          ? 'right'
          : 'left'
        : dy >= 0
          ? 'bottom'
          : 'top';

    return {
      id: `edge-${index + 1}`,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
      label: edge.label,
      direction,
    };
  });

  const width =
    Math.max(...nodes.map(node => node.x + node.width), 0) + 40;
  const height =
    Math.max(...nodes.map(node => node.y + node.height), 0) + 40;

  return {
    kind: 'native',
    width,
    height,
    nodes,
    edges,
  };
}

export function buildMermaidInsertPlan(
  renderResult: MermaidRenderResult
): MermaidInsertPlan {
  if (renderResult.diagramType !== 'flowchart') {
    return {
      kind: 'image',
      width: renderResult.width,
      height: renderResult.height,
      svg: renderResult.svg,
      diagramType: renderResult.diagramType,
    };
  }

  const parsed = parseFlowchart(renderResult.code);
  if (!parsed) {
    return {
      kind: 'image',
      width: renderResult.width,
      height: renderResult.height,
      svg: renderResult.svg,
      diagramType: renderResult.diagramType,
    };
  }

  return (
    layoutFlowchart(parsed) ?? {
      kind: 'image',
      width: renderResult.width,
      height: renderResult.height,
      svg: renderResult.svg,
      diagramType: renderResult.diagramType,
    }
  );
}
