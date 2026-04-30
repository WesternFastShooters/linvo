import {
  CanvasElementType,
  EdgelessCRUDIdentifier,
} from '@linvo/linvo-block-surface';
import {
  ConnectorMode,
  type HighlighterElementModel,
  PointStyle,
} from '@linvo/linvo-model';
import type { IVec } from '@linvo/global/gfx';
import { Bound } from '@linvo/global/gfx';
import type { PointerEventState } from '@linvo/std';
import { BaseTool } from '@linvo/std/gfx';

import {
  MAGIC_BRUSH_IDLE_TIME,
  MAGIC_BRUSH_TRAIL_COLOR,
  MAGIC_BRUSH_TRAIL_WIDTH,
} from './magic-brush-consts.js';
import {
  recognizeMagicBrush,
  type MagicBrushBounds,
  type MagicBrushMatch,
} from './magic-brush-recognizer.js';

export class MagicBrushTool extends BaseTool {
  static override toolName = 'magic-brush';

  private _draggingElement: HighlighterElementModel | null = null;

  private _draggingStroke: IVec[] | null = null;

  private _lastPoint: IVec | null = null;

  private _recognizeTimer: number | null = null;

  private readonly _sessionElementIds: string[] = [];

  private readonly _sessionStrokes: IVec[][] = [];

  private _straightLineType: 'horizontal' | 'vertical' | null = null;

  private _getStraightLineType(currentPoint: IVec) {
    const lastPoint = this._lastPoint;
    if (!lastPoint) return null;

    const dx = currentPoint[0] - lastPoint[0];
    const dy = currentPoint[1] - lastPoint[1];
    const absAngleRadius = Math.abs(Math.atan2(dy, dx));
    return absAngleRadius < Math.PI / 4 || absAngleRadius > 3 * (Math.PI / 4)
      ? 'horizontal'
      : 'vertical';
  }

  private _clearRecognizeTimer() {
    if (this._recognizeTimer !== null) {
      window.clearTimeout(this._recognizeTimer);
      this._recognizeTimer = null;
    }
  }

  private _clearSession(removeElements = true) {
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

  private _normalizeBound(bounds: MagicBrushBounds, enforceSquare: boolean) {
    if (!enforceSquare) {
      return new Bound(bounds.x, bounds.y, bounds.w, bounds.h);
    }

    const size = Math.max(bounds.w, bounds.h);
    const offsetX = (size - bounds.w) / 2;
    const offsetY = (size - bounds.h) / 2;
    return new Bound(bounds.x - offsetX, bounds.y - offsetY, size, size);
  }

  private _scheduleRecognition() {
    this._clearRecognizeTimer();

    this._recognizeTimer = window.setTimeout(() => {
      this._recognizeTimer = null;
      this._recognizeSession();
    }, MAGIC_BRUSH_IDLE_TIME);
  }

  private _recognizeSession() {
    if (!this._sessionStrokes.length) return;

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

  private _commitMatch(match: MagicBrushMatch) {
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
    const left = [match.bounds.x, centerY] as [number, number];
    const right = [match.bounds.x + match.bounds.w, centerY] as [
      number,
      number,
    ];

    const [source, target] =
      match.kind === 'arrow-right' ? [left, right] : [right, left];

    crud.addElement(CanvasElementType.CONNECTOR, {
      mode: ConnectorMode.Straight,
      source: { position: source },
      target: { position: target },
      frontEndpointStyle: PointStyle.None,
      rearEndpointStyle: PointStyle.Arrow,
    });
  }

  override click() {
    // Keep the magic brush focused on drawing gestures only.
  }

  override deactivate() {
    this._clearSession(true);
  }

  override dragEnd() {
    this._draggingElement = null;
    this._draggingStroke = null;
    this._lastPoint = null;
    this._straightLineType = null;
    this._scheduleRecognition();
  }

  override dragMove(e: PointerEventState) {
    if (!this._draggingElement || !this._draggingStroke) return;

    let pointX = e.point.x;
    let pointY = e.point.y;
    const holdingShiftKey = e.keys.shift || this.gfx.keyboard.shiftKey$.peek();
    if (holdingShiftKey) {
      if (!this._straightLineType) {
        this._straightLineType = this._getStraightLineType([pointX, pointY]);
      }

      if (this._straightLineType === 'horizontal') {
        pointY = this._lastPoint?.[1] ?? pointY;
      } else if (this._straightLineType === 'vertical') {
        pointX = this._lastPoint?.[0] ?? pointX;
      }
    } else if (this._straightLineType) {
      this._straightLineType = null;
    }

    const [modelX, modelY] = this.gfx.viewport.toModelCoord(pointX, pointY);
    const points = [...this._draggingStroke, [modelX, modelY] as IVec];

    this._lastPoint = [pointX, pointY];
    this._draggingStroke = points;

    const strokeIndex = this._sessionStrokes.length - 1;
    this._sessionStrokes[strokeIndex] = points;

    this.gfx.updateElement(this._draggingElement, {
      points,
    });
  }

  override dragStart(e: PointerEventState) {
    if (!this.gfx.surface) return;

    if (!this._sessionStrokes.length) {
      this.doc.captureSync();
    }

    this._clearRecognizeTimer();

    const [modelX, modelY] = this.gfx.viewport.toModelCoord(e.point.x, e.point.y);
    const points = [[modelX, modelY] as IVec];
    const id = this.gfx.surface.addElement({
      type: CanvasElementType.HIGHLIGHTER,
      points,
      color: MAGIC_BRUSH_TRAIL_COLOR,
      lineWidth: MAGIC_BRUSH_TRAIL_WIDTH,
    });

    this._draggingElement = this.gfx.getElementById(id) as HighlighterElementModel;
    this._draggingStroke = points;
    this._lastPoint = [e.point.x, e.point.y];
    this._straightLineType = null;

    this._sessionElementIds.push(id);
    this._sessionStrokes.push(points);
  }
}
