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

function parseNodeToken(token: string): ParsedNode | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  if (
    trimmed.includes('<') ||
    trimmed.includes('>') ||
    trimmed.includes('fa:') ||
    trimmed.includes('@{')
  ) {
    return null;
  }

  const match = trimmed.match(/^([A-Za-z0-9_:-]+)(.*)$/);
  if (!match) return null;

  const [, id, rawShape = ''] = match;
  const shape = rawShape.trim();
  if (!shape) {
    return { id, label: id, shapeType: 'rect' };
  }

  const patterns: Array<[RegExp, NativeNodeShape]> = [
    [/^\(\((.+)\)\)$/s, 'ellipse'],
    [/^\(\[(.+)\]\)$/s, 'roundedRect'],
    [/^\((.+)\)$/s, 'roundedRect'],
    [/^\[(.+)\]$/s, 'rect'],
    [/^\{(.+)\}$/s, 'diamond'],
  ];

  for (const [pattern, shapeType] of patterns) {
    const matched = shape.match(pattern);
    if (matched) {
      return {
        id,
        label: stripQuotes(matched[1] ?? id),
        shapeType,
      };
    }
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
  const indegree = new Map<string, number>(nodeIds.map(id => [id, 0]));
  const level = new Map<string, number>(nodeIds.map(id => [id, 0]));

  for (const edge of parsed.edges) {
    indegree.set(edge.targetId, (indegree.get(edge.targetId) ?? 0) + 1);
  }

  const queue = nodeIds.filter(id => (indegree.get(id) ?? 0) === 0);
  if (queue.length === 0) return null;

  let visited = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    visited += 1;
    const currentLevel = level.get(current) ?? 0;

    for (const edge of parsed.edges.filter(item => item.sourceId === current)) {
      const nextLevel = currentLevel + 1;
      level.set(edge.targetId, Math.max(level.get(edge.targetId) ?? 0, nextLevel));
      indegree.set(edge.targetId, (indegree.get(edge.targetId) ?? 1) - 1);
      if ((indegree.get(edge.targetId) ?? 0) === 0) {
        queue.push(edge.targetId);
      }
    }
  }

  if (visited !== nodeIds.length) return null;

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
