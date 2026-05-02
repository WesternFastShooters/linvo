import { shapeMethods } from '@linvo-core/content';

import { RoughSVG } from '@linvo-core/block-surface/utils/rough/svg';

import type {
  MermaidInsertPlan,
  MermaidPreviewModel,
  NativeEdgePlan,
  NativeNodePlan,
} from './types';

const PREVIEW_PADDING = 48;
const TEXT_FONT =
  '"Comic Sans MS", "Marker Felt", "Segoe Print", ui-rounded, sans-serif';

function getNodeAnchor(
  node: NativeNodePlan,
  side: NativeEdgePlan['direction']
): [number, number] {
  const left = node.x + PREVIEW_PADDING;
  const top = node.y + PREVIEW_PADDING;
  const centerX = left + node.width / 2;
  const centerY = top + node.height / 2;

  switch (side) {
    case 'left':
      return [left, centerY];
    case 'right':
      return [left + node.width, centerY];
    case 'top':
      return [centerX, top];
    case 'bottom':
      return [centerX, top + node.height];
  }
}

function appendNode(
  svg: SVGSVGElement,
  rough: RoughSVG,
  node: NativeNodePlan
) {
  const x = node.x + PREVIEW_PADDING;
  const y = node.y + PREVIEW_PADDING;
  const centerX = x + node.width / 2;
  const centerY = y + node.height / 2;
  const options = {
    stroke: '#232329',
    strokeWidth: 2,
    roughness: 0.9,
    bowing: 1.1,
    fill: '#ffffff',
    fillStyle: 'solid' as const,
    seed: 7,
  };

  let shape: SVGGElement;
  switch (node.shapeType) {
    case 'ellipse':
      shape = rough.ellipse(centerX, centerY, node.width, node.height, options);
      break;
    case 'diamond':
      shape = rough.polygon(
        [
          [centerX, y],
          [x + node.width, centerY],
          [centerX, y + node.height],
          [x, centerY],
        ],
        options
      );
      break;
    case 'roundedRect': {
      const radius = Math.min(18, node.width / 5, node.height / 3);
      const d = [
        `M ${x + radius} ${y}`,
        `L ${x + node.width - radius} ${y}`,
        `Q ${x + node.width} ${y} ${x + node.width} ${y + radius}`,
        `L ${x + node.width} ${y + node.height - radius}`,
        `Q ${x + node.width} ${y + node.height} ${x + node.width - radius} ${y + node.height}`,
        `L ${x + radius} ${y + node.height}`,
        `Q ${x} ${y + node.height} ${x} ${y + node.height - radius}`,
        `L ${x} ${y + radius}`,
        `Q ${x} ${y} ${x + radius} ${y}`,
        'Z',
      ].join(' ');
      shape = rough.path(d, options);
      break;
    }
    case 'rect':
    default:
      if (node.shapeType === 'rect') {
        shape = rough.rectangle(x, y, node.width, node.height, options);
        break;
      }

      shape = rough.polygon(
        shapeMethods[node.shapeType].points({
          x,
          y,
          w: node.width,
          h: node.height,
          rotate: 0,
        }) as [number, number][],
        options
      );
      break;
  }

  svg.append(shape);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', `${centerX}`);
  text.setAttribute('y', `${centerY}`);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('font-family', TEXT_FONT);
  text.setAttribute('font-size', '15');
  text.setAttribute('font-weight', '600');
  text.setAttribute('fill', '#232329');

  const lines = node.label.split('\n');
  lines.forEach((line, index) => {
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('x', `${centerX}`);
    tspan.setAttribute(
      'dy',
      index === 0 ? `${-(lines.length - 1) * 0.55}em` : '1.1em'
    );
    tspan.textContent = line;
    text.append(tspan);
  });
  svg.append(text);
}

function appendArrow(svg: SVGSVGElement, edge: NativeEdgePlan, nodeMap: Map<string, NativeNodePlan>) {
  const source = nodeMap.get(edge.sourceId);
  const target = nodeMap.get(edge.targetId);
  if (!source || !target) {
    return;
  }

  const [startX, startY] = getNodeAnchor(
    source,
    edge.direction === 'left'
      ? 'left'
      : edge.direction === 'right'
        ? 'right'
        : edge.direction === 'top'
          ? 'top'
          : 'bottom'
  );
  const opposite =
    edge.direction === 'left'
      ? 'right'
      : edge.direction === 'right'
        ? 'left'
        : edge.direction === 'top'
          ? 'bottom'
          : 'top';
  const [endX, endY] = getNodeAnchor(target, opposite);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const isHorizontal = Math.abs(endX - startX) >= Math.abs(endY - startY);
  const d = isHorizontal
    ? `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`
    : `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`;
  line.setAttribute('d', d);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#232329');
  line.setAttribute('stroke-width', '2.4');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-linejoin', 'round');
  line.setAttribute('marker-end', 'url(#mermaid-preview-arrowhead)');
  svg.append(line);

  if (edge.label) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', `${(startX + endX) / 2}`);
    text.setAttribute('y', `${(startY + endY) / 2 - 12}`);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', TEXT_FONT);
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', '600');
    text.setAttribute('fill', '#232329');
    text.textContent = edge.label;
    svg.append(text);
  }
}

function createArrowMarker(svg: SVGSVGElement) {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'mermaid-preview-arrowhead');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('refX', '7');
  marker.setAttribute('refY', '4');
  marker.setAttribute('orient', 'auto');
  marker.setAttribute('markerUnits', 'strokeWidth');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 0 0 L 8 4 L 0 8 z');
  path.setAttribute('fill', '#232329');
  marker.append(path);
  defs.append(marker);
  svg.append(defs);
}

export function buildMermaidPreviewModel(
  plan: MermaidInsertPlan,
  fallbackSvg: string
): MermaidPreviewModel {
  if (plan.kind !== 'native') {
    return {
      mode: 'image',
      svg: fallbackSvg,
      width: plan.width,
      height: plan.height,
    };
  }

  const width = plan.width + PREVIEW_PADDING * 2;
  const height = plan.height + PREVIEW_PADDING * 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', `${width}`);
  svg.setAttribute('height', `${height}`);
  svg.setAttribute('fill', 'none');

  createArrowMarker(svg);

  const rough = new RoughSVG(svg, {
    options: {
      roughness: 0.9,
      bowing: 1.1,
      stroke: '#232329',
      strokeWidth: 2,
      fill: '#ffffff',
      fillStyle: 'solid',
      seed: 7,
    },
  });

  const nodeMap = new Map(plan.nodes.map(node => [node.id, node]));
  for (const edge of plan.edges) {
    appendArrow(svg, edge, nodeMap);
  }
  for (const node of plan.nodes) {
    appendNode(svg, rough, node);
  }

  return {
    mode: 'native',
    svg: svg.outerHTML,
    width,
    height,
  };
}
