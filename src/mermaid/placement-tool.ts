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
import { ThemeProvider } from '@blocksuite/affine/shared/services';
import { Bound } from '@blocksuite/global/gfx';
import type { PointerEventState } from '@blocksuite/std';
import { BaseTool } from '@blocksuite/std/gfx';
import * as Y from 'yjs';

import type { MermaidInsertController } from './controller';
import type {
  MermaidInsertPlan,
  MermaidRenderResult,
  NativeNodeShape,
} from './types';

type MermaidPlacementOptions = {
  controller: MermaidInsertController;
  plan: MermaidInsertPlan;
  renderResult: MermaidRenderResult;
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
    private readonly renderResult: MermaidRenderResult
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
  if (shapeType === 'roundedRect') {
    return {
      shapeType: ShapeType.Rect,
      radius: 0.1,
    };
  }

  return {
    shapeType:
      shapeType === 'rect'
        ? ShapeType.Rect
        : shapeType === 'ellipse'
          ? ShapeType.Ellipse
          : shapeType === 'diamond'
            ? ShapeType.Diamond
            : ShapeType.Rect,
    radius: 0,
  };
}

export class MermaidPlacementTool extends BaseTool<MermaidPlacementOptions> {
  static override toolName = 'mermaid-placement';

  private overlay: MermaidGhostOverlay | null = null;
  private escapeHandler: ((event: KeyboardEvent) => void) | null = null;

  private get surfaceComponent() {
    return this.gfx.surfaceComponent as SurfaceBlockComponent | null;
  }

  override activate(options: MermaidPlacementOptions) {
    this.overlay = new MermaidGhostOverlay(this.gfx, options.renderResult);
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
  const createdNodeIds = new Map<string, string>();
  const offsetX = x - plan.width / 2;
  const offsetY = y - plan.height / 2;

  context.doc.captureSync();

  for (const node of plan.nodes) {
    const shapeProps = getShapeProps(node.shapeType);
    const shapeId = crud.addElement('shape', {
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
