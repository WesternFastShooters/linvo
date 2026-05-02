import type { PointerEventState } from '@linvo-core/std';
import { BaseTool } from '@linvo-core/std/gfx';
export declare class MagicBrushTool extends BaseTool {
    static toolName: string;
    private _draggingElement;
    private _draggingStroke;
    private _lastPoint;
    private _recognizeTimer;
    private readonly _sessionElementIds;
    private readonly _sessionStrokes;
    private _straightLineType;
    private _getStraightLineType;
    private _clearRecognizeTimer;
    private _clearSession;
    private _normalizeBound;
    private _scheduleRecognition;
    private _recognizeSession;
    private _commitMatch;
    click(): void;
    deactivate(): void;
    dragEnd(): void;
    dragMove(e: PointerEventState): void;
    dragStart(e: PointerEventState): void;
}
