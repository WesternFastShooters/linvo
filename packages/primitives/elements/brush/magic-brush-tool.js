import { CanvasElementType, EdgelessCRUDIdentifier, } from '@linvo-core/block-surface';
import { ConnectorMode, PointStyle, } from '@linvo-core/content';
import { Bound } from '@linvo-core/global/gfx';
import { BaseTool } from '@linvo-core/std/gfx';
import { MAGIC_BRUSH_IDLE_TIME, MAGIC_BRUSH_TRAIL_COLOR, MAGIC_BRUSH_TRAIL_WIDTH, } from './magic-brush-consts';
import { recognizeMagicBrush, } from './magic-brush-recognizer';
export class MagicBrushTool extends BaseTool {
    constructor() {
        super(...arguments);
        this._draggingElement = null;
        this._draggingStroke = null;
        this._lastPoint = null;
        this._recognizeTimer = null;
        this._sessionElementIds = [];
        this._sessionStrokes = [];
        this._straightLineType = null;
    }
    static { this.toolName = 'magic-brush'; }
    _getStraightLineType(currentPoint) {
        const lastPoint = this._lastPoint;
        if (!lastPoint)
            return null;
        const dx = currentPoint[0] - lastPoint[0];
        const dy = currentPoint[1] - lastPoint[1];
        const absAngleRadius = Math.abs(Math.atan2(dy, dx));
        return absAngleRadius < Math.PI / 4 || absAngleRadius > 3 * (Math.PI / 4)
            ? 'horizontal'
            : 'vertical';
    }
    _clearRecognizeTimer() {
        if (this._recognizeTimer !== null) {
            window.clearTimeout(this._recognizeTimer);
            this._recognizeTimer = null;
        }
    }
    _clearSession(removeElements = true) {
        this._clearRecognizeTimer();
        if (removeElements) {
            this._sessionElementIds.forEach(id => {
                if (this.gfx.getElementById(id)) {
                    this.gfx.deleteElement(id);
                }
            });
        }
        this._sessionElementIds.length = 0;
        this._sessionStrokes.length = 0;
        this._draggingElement = null;
        this._draggingStroke = null;
        this._lastPoint = null;
        this._straightLineType = null;
    }
    _normalizeBound(bounds, enforceSquare) {
        if (!enforceSquare) {
            return new Bound(bounds.x, bounds.y, bounds.w, bounds.h);
        }
        const size = Math.max(bounds.w, bounds.h);
        const offsetX = (size - bounds.w) / 2;
        const offsetY = (size - bounds.h) / 2;
        return new Bound(bounds.x - offsetX, bounds.y - offsetY, size, size);
    }
    _scheduleRecognition() {
        this._clearRecognizeTimer();
        this._recognizeTimer = window.setTimeout(() => {
            this._recognizeTimer = null;
            this._recognizeSession();
        }, MAGIC_BRUSH_IDLE_TIME);
    }
    _recognizeSession() {
        if (!this._sessionStrokes.length)
            return;
        const match = recognizeMagicBrush(this._sessionStrokes);
        this.doc.transact(() => {
            this._sessionElementIds.forEach(id => {
                if (this.gfx.getElementById(id)) {
                    this.gfx.deleteElement(id);
                }
            });
            if (match) {
                this._commitMatch(match);
            }
        });
        this._clearSession(false);
        this.doc.captureSync();
    }
    _commitMatch(match) {
        const crud = this.std.get(EdgelessCRUDIdentifier);
        if (match.type === 'shape') {
            const bound = this._normalizeBound(match.bounds, match.enforceSquare);
            crud.addElement(CanvasElementType.SHAPE, {
                shapeType: match.shapeType,
                xywh: bound.serialize(),
            });
            return;
        }
        const centerY = match.bounds.y + match.bounds.h / 2;
        const left = [match.bounds.x, centerY];
        const right = [match.bounds.x + match.bounds.w, centerY];
        const [source, target] = match.kind === 'arrow-right' ? [left, right] : [right, left];
        crud.addElement(CanvasElementType.CONNECTOR, {
            mode: ConnectorMode.Straight,
            source: { position: source },
            target: { position: target },
            frontEndpointStyle: PointStyle.None,
            rearEndpointStyle: PointStyle.Arrow,
        });
    }
    click() {
        // Keep the magic brush focused on drawing gestures only.
    }
    deactivate() {
        this._clearSession(true);
    }
    dragEnd() {
        this._draggingElement = null;
        this._draggingStroke = null;
        this._lastPoint = null;
        this._straightLineType = null;
        this._scheduleRecognition();
    }
    dragMove(e) {
        if (!this._draggingElement || !this._draggingStroke)
            return;
        let pointX = e.point.x;
        let pointY = e.point.y;
        const holdingShiftKey = e.keys.shift || this.gfx.keyboard.shiftKey$.peek();
        if (holdingShiftKey) {
            if (!this._straightLineType) {
                this._straightLineType = this._getStraightLineType([pointX, pointY]);
            }
            if (this._straightLineType === 'horizontal') {
                pointY = this._lastPoint?.[1] ?? pointY;
            }
            else if (this._straightLineType === 'vertical') {
                pointX = this._lastPoint?.[0] ?? pointX;
            }
        }
        else if (this._straightLineType) {
            this._straightLineType = null;
        }
        const [modelX, modelY] = this.gfx.viewport.toModelCoord(pointX, pointY);
        const points = [...this._draggingStroke, [modelX, modelY]];
        this._lastPoint = [pointX, pointY];
        this._draggingStroke = points;
        const strokeIndex = this._sessionStrokes.length - 1;
        this._sessionStrokes[strokeIndex] = points;
        this.gfx.updateElement(this._draggingElement, {
            points,
        });
    }
    dragStart(e) {
        if (!this.gfx.surface)
            return;
        if (!this._sessionStrokes.length) {
            this.doc.captureSync();
        }
        this._clearRecognizeTimer();
        const [modelX, modelY] = this.gfx.viewport.toModelCoord(e.point.x, e.point.y);
        const points = [[modelX, modelY]];
        const id = this.gfx.surface.addElement({
            type: CanvasElementType.HIGHLIGHTER,
            points,
            color: MAGIC_BRUSH_TRAIL_COLOR,
            lineWidth: MAGIC_BRUSH_TRAIL_WIDTH,
        });
        this._draggingElement = this.gfx.getElementById(id);
        this._draggingStroke = points;
        this._lastPoint = [e.point.x, e.point.y];
        this._straightLineType = null;
        this._sessionElementIds.push(id);
        this._sessionStrokes.push(points);
    }
}
