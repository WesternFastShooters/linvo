import { addImages } from '@linvo-primitives/image/utils';
import { DefaultTool, EdgelessCRUDIdentifier, ToolOverlay, } from '@linvo-core/block-surface';
import { createGroupCommand } from '@linvo-primitives/group';
import { createSurfaceText } from '@linvo-primitives/text';
import { ShapeType } from '@linvo-core/content';
import { EditPropsStore, ThemeProvider, } from '@linvo-core/shared/services';
import { Bound } from '@linvo-core/global/gfx';
import { BaseTool } from '@linvo-core/std/gfx';
import { buildMermaidPreviewModel } from './preview';
class MermaidGhostOverlay extends ToolOverlay {
    static { this.overlayName = 'mermaid-ghost'; }
    constructor(gfx, renderResult) {
        super(gfx);
        this.renderResult = renderResult;
        this.image = new Image();
        this.ready = false;
        this.image.onload = () => {
            this.ready = true;
            this.refresh();
        };
        this.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderResult.svg)}`;
    }
    render(ctx) {
        const left = this.x - this.renderResult.width / 2;
        const top = this.y - this.renderResult.height / 2;
        ctx.save();
        ctx.globalAlpha = 0.55;
        if (this.ready) {
            ctx.drawImage(this.image, left, top, this.renderResult.width, this.renderResult.height);
        }
        else {
            ctx.fillStyle = this.gfx.std
                .get(ThemeProvider)
                .getCssVariableColor('--linvo-hover-color');
            ctx.strokeStyle = this.gfx.std
                .get(ThemeProvider)
                .getCssVariableColor('--linvo-primary-color');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(left, top, this.renderResult.width, this.renderResult.height, 12);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }
}
function getConnectorPositions(direction) {
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
function getShapeProps(shapeType) {
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
    };
    return mapped[shapeType];
}
export class MermaidPlacementTool extends BaseTool {
    constructor() {
        super(...arguments);
        this.overlay = null;
        this.escapeHandler = null;
    }
    static { this.toolName = 'mermaid-placement'; }
    get surfaceComponent() {
        return this.gfx.surfaceComponent;
    }
    activate(options) {
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
    deactivate() {
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
    pointerMove(event) {
        if (!this.overlay)
            return;
        const [x, y] = this.gfx.viewport.toModelCoord(event.x, event.y);
        this.overlay.x = x;
        this.overlay.y = y;
        this.surfaceComponent?.refresh();
    }
    async click(event) {
        const { plan, renderResult } = this.activatedOption;
        const [x, y] = this.gfx.viewport.toModelCoord(event.x, event.y);
        await commitMermaidPlan(this, plan, renderResult, [x, y]);
        this.gfx.tool.setTool(DefaultTool);
    }
}
export async function commitMermaidPlan(context, plan, renderResult, anchor) {
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
    const createdNodeIds = new Map();
    const offsetX = x - plan.width / 2;
    const offsetY = y - plan.height / 2;
    context.doc.captureSync();
    for (const node of plan.nodes) {
        const shapeProps = getShapeProps(node.shapeType);
        const lastProps = editPropsStore.lastProps$.value[`shape:${shapeProps.shapeName}`];
        const semanticShapeProps = node.shapeType === 'filledCircle' || node.shapeType === 'forkJoin'
            ? {
                filled: true,
                fillColor: lastProps && 'strokeColor' in lastProps
                    ? lastProps.strokeColor
                    : undefined,
            }
            : null;
        const shapeId = crud.addElement('shape', {
            ...lastProps,
            ...semanticShapeProps,
            shapeType: shapeProps.shapeType,
            radius: shapeProps.radius,
            xywh: new Bound(offsetX + node.x + node.width / 2, offsetY + node.y + node.height / 2, node.width, node.height).serialize(),
            text: createSurfaceText(node.label),
        });
        if (shapeId) {
            createdNodeIds.set(node.id, shapeId);
        }
    }
    const createdConnectorIds = [];
    for (const edge of plan.edges) {
        const sourceId = createdNodeIds.get(edge.sourceId);
        const targetId = createdNodeIds.get(edge.targetId);
        if (!sourceId || !targetId)
            continue;
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
            text: edge.label ? createSurfaceText(edge.label) : undefined,
        });
        if (connectorId) {
            createdConnectorIds.push(connectorId);
            if (edge.label) {
                const sourceNode = plan.nodes.find(node => node.id === edge.sourceId);
                const targetNode = plan.nodes.find(node => node.id === edge.targetId);
                const midX = offsetX +
                    (sourceNode.x +
                        sourceNode.width / 2 +
                        targetNode.x +
                        targetNode.width / 2) /
                        2;
                const midY = offsetY +
                    (sourceNode.y +
                        sourceNode.height / 2 +
                        targetNode.y +
                        targetNode.height / 2) /
                        2;
                crud.updateElement(connectorId, {
                    labelXYWH: [midX - 40, midY - 12, 80, 24],
                });
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
    }
    else {
        context.gfx.selection.set({
            elements: allIds,
            editing: false,
        });
    }
}
