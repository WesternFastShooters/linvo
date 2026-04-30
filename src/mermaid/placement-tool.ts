import { addImages } from '@blocksuite/affine/blocks/image';
import {
  DefaultTool,
  EdgelessCRUDIdentifier,
  type SurfaceBlockComponent,
  ToolOverlay,
} from '@blocksuite/affine/blocks/surface';
import { createGroupCommand } from '@blocksuite/affine/gfx/group';
import type { ConnectorElementModel } from '@blocksuite/affine/model';
import { ShapeType } from '@blocksuite/affine/model';
import {
  EditPropsStore,
  ThemeProvider,
} from '@blocksuite/affine/shared/services';
import { Bound } from '@blocksuite/global/gfx';
import type { PointerEventState } from '@blocksuite/std';
import { BaseTool } from '@blocksuite/std/gfx';
import * as Y from 'yjs';

import type { MermaidInsertController } from './controller';
import { buildMermaidPreviewModel } from './preview';
import type {
  MermaidInsertPlan,
  NativeNodeShape,
} from './types';

type MermaidPlacementOptions = {
  controller: MermaidInsertController;
  plan: MermaidInsertPlan;
  overlaySvg: string;
  overlayWidth: number;
  overlayHeight: number;
};

type MermaidCommitContext = Pick<
  MermaidPlacementTool,
  'doc' | 'gfx' | 'std'
>;

class MermaidGhostOverlay extends ToolOverlay {
  static override overlayName = 'mermaid-ghost';

  private readonly image = new Image();
  private ready = false;

  constructor(
    gfx: MermaidPlacementTool['gfx'],
    private readonly renderResult: {
      svg: string;
      width: number;
      height: number;
    }
  ) {
    super(gfx);
    this.image.onload = () => {
      this.ready = true;
      this.refresh();
    };
    this.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      renderResult.svg
    )}`;
  }

  override render(ctx: CanvasRenderingContext2D) {
    const left = this.x - this.renderResult.width / 2;
    const top = this.y - this.renderResult.height / 2;

    ctx.save();
    ctx.globalAlpha = 0.55;
    if (this.ready) {
      ctx.drawImage(
        this.image,
        left,
        top,
        this.renderResult.width,
        this.renderResult.height
      );
    } else {
      ctx.fillStyle = this.gfx.std
        .get(ThemeProvider)
        .getCssVariableColor('--affine-hover-color');
      ctx.strokeStyle = this.gfx.std
        .get(ThemeProvider)
        .getCssVariableColor('--affine-primary-color');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(
        left,
        top,
        this.renderResult.width,
        this.renderResult.height,
        12
      );
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
}

function getConnectorPositions(direction: 'left' | 'right' | 'top' | 'bottom') {
  switch (direction) {
    case 'right':
      return { source: [1, 0.5], target: [0, 0.5] };
    case 'left':
      return { source: [0, 0.5], target: [1, 0.5] };
    case 'bottom':
      return { source: [0.5, 1], target: [0.5, 0] };
    case 'top':
      return { source: [0.5, 0], target: [0.5, 1] };
  }
}

function getShapeProps(shapeType: NativeNodeShape) {
  const mapped = {
    rect: { shapeType: ShapeType.Rect, radius: 0, shapeName: 'rect' },
    roundedRect: {
      shapeType: ShapeType.Rect,
      radius: 0.1,
      shapeName: 'roundedRect',
    },
    triangle: { shapeType: ShapeType.Triangle, radius: 0, shapeName: 'triangle' },
    diamond: { shapeType: ShapeType.Diamond, radius: 0, shapeName: 'diamond' },
    ellipse: { shapeType: ShapeType.Ellipse, radius: 0, shapeName: 'ellipse' },
    hexagon: { shapeType: ShapeType.Hexagon, radius: 0, shapeName: 'hexagon' },
    pentagon: { shapeType: ShapeType.Pentagon, radius: 0, shapeName: 'pentagon' },
    octagon: { shapeType: ShapeType.Octagon, radius: 0, shapeName: 'octagon' },
    parallelogram: {
      shapeType: ShapeType.Parallelogram,
      radius: 0,
      shapeName: 'parallelogram',
    },
    leanLeft: {
      shapeType: ShapeType.LeanLeft,
      radius: 0,
      shapeName: 'leanLeft',
    },
    trapezoid: {
      shapeType: ShapeType.Trapezoid,
      radius: 0,
      shapeName: 'trapezoid',
    },
    trapezoidAlt: {
      shapeType: ShapeType.TrapezoidAlt,
      radius: 0,
      shapeName: 'trapezoidAlt',
    },
    stadium: { shapeType: ShapeType.Stadium, radius: 0, shapeName: 'stadium' },
    subroutine: {
      shapeType: ShapeType.Subroutine,
      radius: 0,
      shapeName: 'subroutine',
    },
    cylinder: {
      shapeType: ShapeType.Cylinder,
      radius: 0,
      shapeName: 'cylinder',
    },
    horizontalCylinder: {
      shapeType: ShapeType.HorizontalCylinder,
      radius: 0,
      shapeName: 'horizontalCylinder',
    },
    linedCylinder: {
      shapeType: ShapeType.LinedCylinder,
      radius: 0,
      shapeName: 'linedCylinder',
    },
    document: {
      shapeType: ShapeType.Document,
      radius: 0,
      shapeName: 'document',
    },
    linedDocument: {
      shapeType: ShapeType.LinedDocument,
      radius: 0,
      shapeName: 'linedDocument',
    },
    multiDocument: {
      shapeType: ShapeType.MultiDocument,
      radius: 0,
      shapeName: 'multiDocument',
    },
    note: { shapeType: ShapeType.Note, radius: 0, shapeName: 'note' },
    package: { shapeType: ShapeType.Package, radius: 0, shapeName: 'package' },
    cloud: { shapeType: ShapeType.Cloud, radius: 0, shapeName: 'cloud' },
    doubleCircle: {
      shapeType: ShapeType.DoubleCircle,
      radius: 0,
      shapeName: 'doubleCircle',
    },
    filledCircle: {
      shapeType: ShapeType.FilledCircle,
      radius: 0,
      shapeName: 'filledCircle',
    },
    asymmetric: {
      shapeType: ShapeType.Asymmetric,
      radius: 0,
      shapeName: 'asymmetric',
    },
    hourglass: {
      shapeType: ShapeType.Hourglass,
      radius: 0,
      shapeName: 'hourglass',
    },
    notchedRect: {
      shapeType: ShapeType.NotchedRect,
      radius: 0,
      shapeName: 'notchedRect',
    },
    notchedPentagon: {
      shapeType: ShapeType.NotchedPentagon,
      radius: 0,
      shapeName: 'notchedPentagon',
    },
    bolt: { shapeType: ShapeType.Bolt, radius: 0, shapeName: 'bolt' },
    bang: { shapeType: ShapeType.Bang, radius: 0, shapeName: 'bang' },
    flag: { shapeType: ShapeType.Flag, radius: 0, shapeName: 'flag' },
    bowRect: { shapeType: ShapeType.BowRect, radius: 0, shapeName: 'bowRect' },
    smallCircle: {
      shapeType: ShapeType.SmallCircle,
      radius: 0,
      shapeName: 'smallCircle',
    },
    framedCircle: {
      shapeType: ShapeType.FramedCircle,
      radius: 0,
      shapeName: 'framedCircle',
    },
    crossedCircle: {
      shapeType: ShapeType.CrossedCircle,
      radius: 0,
      shapeName: 'crossedCircle',
    },
    taggedDocument: {
      shapeType: ShapeType.TaggedDocument,
      radius: 0,
      shapeName: 'taggedDocument',
    },
    taggedRect: {
      shapeType: ShapeType.TaggedRect,
      radius: 0,
      shapeName: 'taggedRect',
    },
    braceLeft: {
      shapeType: ShapeType.BraceLeft,
      radius: 0,
      shapeName: 'braceLeft',
    },
    braceRight: {
      shapeType: ShapeType.BraceRight,
      radius: 0,
      shapeName: 'braceRight',
    },
    braces: { shapeType: ShapeType.Braces, radius: 0, shapeName: 'braces' },
    delay: { shapeType: ShapeType.Delay, radius: 0, shapeName: 'delay' },
    curvedTrapezoid: {
      shapeType: ShapeType.CurvedTrapezoid,
      radius: 0,
      shapeName: 'curvedTrapezoid',
    },
    dividedRect: {
      shapeType: ShapeType.DividedRect,
      radius: 0,
      shapeName: 'dividedRect',
    },
    forkJoin: {
      shapeType: ShapeType.ForkJoin,
      radius: 0,
      shapeName: 'forkJoin',
    },
    windowPane: {
      shapeType: ShapeType.WindowPane,
      radius: 0,
      shapeName: 'windowPane',
    },
    linedRect: {
      shapeType: ShapeType.LinedRect,
      radius: 0,
      shapeName: 'linedRect',
    },
    flippedTriangle: {
      shapeType: ShapeType.FlippedTriangle,
      radius: 0,
      shapeName: 'flippedTriangle',
    },
    slopedRect: {
      shapeType: ShapeType.SlopedRect,
      radius: 0,
      shapeName: 'slopedRect',
    },
    stackedRect: {
      shapeType: ShapeType.StackedRect,
      radius: 0,
      shapeName: 'stackedRect',
    },
    odd: { shapeType: ShapeType.Odd, radius: 0, shapeName: 'odd' },
  } satisfies Record<
    NativeNodeShape,
    { shapeType: ShapeType; radius: number; shapeName: string }
  >;

  return mapped[shapeType];
}

export class MermaidPlacementTool extends BaseTool<MermaidPlacementOptions> {
  static override toolName = 'mermaid-placement';

  private overlay: MermaidGhostOverlay | null = null;
  private escapeHandler: ((event: KeyboardEvent) => void) | null = null;

  private get surfaceComponent() {
    return this.gfx.surfaceComponent as SurfaceBlockComponent | null;
  }

  override activate(options: MermaidPlacementOptions) {
    this.overlay = new MermaidGhostOverlay(this.gfx, {
      svg: options.overlaySvg,
      width: options.overlayWidth,
      height: options.overlayHeight,
    });
    this.surfaceComponent?.renderer.addOverlay(this.overlay);
    this.escapeHandler = event => {
      if (event.key === 'Escape') {
        this.gfx.tool.setTool(DefaultTool);
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  override deactivate() {
    if (this.overlay) {
      this.overlay.dispose();
      this.surfaceComponent?.renderer.removeOverlay(this.overlay);
      this.overlay = null;
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
  }

  override pointerMove(event: PointerEventState) {
    if (!this.overlay) return;
    const [x, y] = this.gfx.viewport.toModelCoord(event.x, event.y);
    this.overlay.x = x;
    this.overlay.y = y;
    this.surfaceComponent?.refresh();
  }

  override async click(event: PointerEventState) {
    const { plan, renderResult } = this.activatedOption;
    const [x, y] = this.gfx.viewport.toModelCoord(event.x, event.y);
    await commitMermaidPlan(this, plan, renderResult, [x, y]);
    this.gfx.tool.setTool(DefaultTool);
  }
}

export async function commitMermaidPlan(
  context: MermaidCommitContext,
  plan: MermaidInsertPlan,
  renderResult: MermaidRenderResult,
  anchor: [number, number]
) {
  const [x, y] = anchor;

  if (plan.kind === 'image') {
    const file = new File([renderResult.svg], 'mermaid.svg', {
      type: 'image/svg+xml',
    });
    await addImages(context.std, [file], {
      point: [x, y],
      shouldTransformPoint: false,
    });
    return;
  }

  const crud = context.std.get(EdgelessCRUDIdentifier);
  const editPropsStore = context.std.get(EditPropsStore);
  const createdNodeIds = new Map<string, string>();
  const offsetX = x - plan.width / 2;
  const offsetY = y - plan.height / 2;

  context.doc.captureSync();

  for (const node of plan.nodes) {
    const shapeProps = getShapeProps(node.shapeType);
    const lastProps =
      editPropsStore.lastProps$.value[
        `shape:${shapeProps.shapeName}` as keyof typeof editPropsStore.lastProps$.value
      ];
    const semanticShapeProps =
      node.shapeType === 'filledCircle' || node.shapeType === 'forkJoin'
        ? {
            filled: true,
            fillColor: lastProps?.strokeColor,
          }
        : null;
    const shapeId = crud.addElement('shape', {
      ...lastProps,
      ...semanticShapeProps,
      shapeType: shapeProps.shapeType,
      radius: shapeProps.radius,
      xywh: new Bound(
        offsetX + node.x + node.width / 2,
        offsetY + node.y + node.height / 2,
        node.width,
        node.height
      ).serialize(),
      text: new Y.Text(node.label),
    });
    if (shapeId) {
      createdNodeIds.set(node.id, shapeId);
    }
  }

  const createdConnectorIds: string[] = [];
  for (const edge of plan.edges) {
    const sourceId = createdNodeIds.get(edge.sourceId);
    const targetId = createdNodeIds.get(edge.targetId);
    if (!sourceId || !targetId) continue;
    const positions = getConnectorPositions(edge.direction);
    const connectorId = crud.addElement('connector', {
      source: {
        id: sourceId,
        position: positions.source,
      },
      target: {
        id: targetId,
        position: positions.target,
      },
      text: edge.label ? new Y.Text(edge.label) : undefined,
    });

    if (connectorId) {
      createdConnectorIds.push(connectorId);
      if (edge.label) {
        const sourceNode = plan.nodes.find(node => node.id === edge.sourceId)!;
        const targetNode = plan.nodes.find(node => node.id === edge.targetId)!;
        const midX =
          offsetX +
          (sourceNode.x +
            sourceNode.width / 2 +
            targetNode.x +
            targetNode.width / 2) /
            2;
        const midY =
          offsetY +
          (sourceNode.y +
            sourceNode.height / 2 +
            targetNode.y +
            targetNode.height / 2) /
            2;
        crud.updateElement(connectorId, {
          labelXYWH: [midX - 40, midY - 12, 80, 24],
        } satisfies Partial<ConnectorElementModel>);
      }
    }
  }

  const allIds = [...createdNodeIds.values(), ...createdConnectorIds];
  const [_, result] = context.std.command.exec(createGroupCommand, {
    elements: allIds,
  });

  if (result?.groupId) {
    context.gfx.selection.set({
      elements: [result.groupId],
      editing: false,
    });
  } else {
    context.gfx.selection.set({
      elements: allIds,
      editing: false,
    });
  }
}
