import { DefaultTool, OverlayIdentifier, } from '@linvo-core/block-surface';
import { EditPropsStore, TelemetryProvider, } from '@linvo-core/shared/services';
import { Bound, Vec } from '@linvo-core/global/gfx';
import { BaseTool, getTopElements } from '@linvo-core/std/gfx';
import { Text } from '@linvo-core/store';
import { EdgelessFrameManagerIdentifier, } from './frame-manager';
export class FrameTool extends BaseTool {
    constructor() {
        super(...arguments);
        this._frame = null;
        this._startPoint = null;
    }
    static { this.toolName = 'frame'; }
    get frameManager() {
        return this.std.get(EdgelessFrameManagerIdentifier);
    }
    get frameOverlay() {
        return this.std.get(OverlayIdentifier('frame'));
    }
    _toModelCoord(p) {
        return this.gfx.viewport.toModelCoord(p.x, p.y);
    }
    dragEnd() {
        if (this._frame) {
            const frame = this._frame;
            frame.pop('xywh');
            this.gfx.tool.setTool(DefaultTool);
            this.gfx.selection.set({
                elements: [frame.id],
                editing: false,
            });
            this.frameManager.addElementsToFrame(frame, getTopElements(this.frameManager.getElementsInFrameBound(frame)));
        }
        this._frame = null;
        this._startPoint = null;
        this.frameOverlay.clear();
    }
    dragMove(e) {
        if (!this._startPoint)
            return;
        const currentPoint = this._toModelCoord(e.point);
        if (Vec.dist(this._startPoint, currentPoint) < 8 && !this._frame)
            return;
        if (!this._frame) {
            const frames = this.gfx.layer.blocks.filter(block => block.flavour === 'linvo:frame');
            const props = this.std
                .get(EditPropsStore)
                .applyLastProps('linvo:frame', {
                title: new Text(`Frame ${frames.length + 1}`),
                xywh: Bound.fromPoints([this._startPoint, currentPoint]).serialize(),
                index: this.gfx.layer.generateIndex(true),
                presentationIndex: this.frameManager.generatePresentationIndex(),
            });
            const id = this.doc.addBlock('linvo:frame', props, this.gfx.surface);
            this.std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
                control: 'canvas:draw',
                page: 'whiteboard editor',
                module: 'toolbar',
                segment: 'toolbar',
                type: 'frame',
            });
            this._frame = this.gfx.getElementById(id);
            this._frame.stash('xywh');
            return;
        }
        this.gfx.doc.updateBlock(this._frame, {
            xywh: Bound.fromPoints([this._startPoint, currentPoint]).serialize(),
        });
        this.frameOverlay.highlight(this._frame, true);
    }
    dragStart(e) {
        this.doc.captureSync();
        const { point } = e;
        this._startPoint = this._toModelCoord(point);
    }
}
