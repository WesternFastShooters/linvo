import type { MermaidDiagramType, MermaidRenderResult } from './types';

type MermaidRuntime = {
  initialize(config: Record<string, unknown>): void;
  parse?(code: string): Promise<unknown>;
  detectType?(code: string): MermaidDiagramType | string;
  render(
    id: string,
    code: string
  ): Promise<{
    svg: string;
    bindFunctions?: (element: Element) => void;
  }>;
};

declare global {
  interface Window {
    mermaid?: MermaidRuntime;
  }
}

let loader: Promise<MermaidRuntime> | null = null;
let initialized = false;
let runtimeForTesting: MermaidRuntime | null = null;

function inferDiagramType(code: string): MermaidDiagramType {
  const firstLine = code
    .split('\n')
    .map(line => line.trim())
    .find(Boolean)
    ?.toLowerCase();

  if (!firstLine) return 'unknown';
  if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
    return 'flowchart';
  }
  if (firstLine.startsWith('pie')) return 'pie';
  if (firstLine.startsWith('sequencediagram')) return 'sequence';
  if (firstLine.startsWith('classdiagram')) return 'class';
  return 'unknown';
}

function extractSvgSize(svg: string) {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const svgElement = doc.documentElement;
  const widthAttr = svgElement.getAttribute('width');
  const heightAttr = svgElement.getAttribute('height');
  const viewBox = svgElement.getAttribute('viewBox');

  const width = Number.parseFloat(widthAttr ?? '');
  const height = Number.parseFloat(heightAttr ?? '');
  if (Number.isFinite(width) && Number.isFinite(height)) {
    return { width, height };
  }

  if (viewBox) {
    const parts = viewBox
      .split(/[,\s]+/)
      .map(part => Number.parseFloat(part))
      .filter(Number.isFinite);
    if (parts.length === 4) {
      return { width: parts[2]!, height: parts[3]! };
    }
  }

  return { width: 640, height: 480 };
}

async function loadRuntime() {
  if (runtimeForTesting) return runtimeForTesting;
  if (window.mermaid) return window.mermaid;

  loader ??= import('mermaid').then(module => {
    const runtime = module.default as MermaidRuntime;
    window.mermaid = runtime;
    return runtime;
  });

  return loader;
}

export async function ensureMermaidRuntime() {
  const runtime = await loadRuntime();
  if (!initialized && runtime.initialize) {
    runtime.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      suppressErrorRendering: true,
    });
    initialized = true;
  }
  return runtime;
}

export async function renderMermaid(code: string): Promise<MermaidRenderResult> {
  const runtime = await ensureMermaidRuntime();
  const normalizedCode = code.trim();

  if (!normalizedCode) {
    throw new Error('Mermaid code cannot be empty.');
  }

  if (runtime.parse) {
    await runtime.parse(normalizedCode);
  }

  const rendered = await runtime.render(
    `mermaid-insert-${Math.random().toString(36).slice(2)}`,
    normalizedCode
  );

  const diagramType = (() => {
    try {
      const detected = runtime.detectType?.(normalizedCode);
      if (detected === 'flowchart' || detected === 'pie') return detected;
      if (detected === 'sequence') return 'sequence';
      if (detected === 'class') return 'class';
      return inferDiagramType(normalizedCode);
    } catch {
      return inferDiagramType(normalizedCode);
    }
  })();

  const { width, height } = extractSvgSize(rendered.svg);

  return {
    code: normalizedCode,
    svg: rendered.svg,
    width,
    height,
    diagramType,
  };
}

export function __setMermaidRuntimeForTesting(runtime: MermaidRuntime | null) {
  runtimeForTesting = runtime;
  loader = null;
  initialized = false;
}
