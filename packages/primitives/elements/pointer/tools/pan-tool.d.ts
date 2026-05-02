import type { PointerEventState } from '@linvo-core/std';
import { BaseTool } from '@linvo-core/std/gfx';
import { Signal } from '@preact/signals-core';
export type PanToolOption = {
    panning: boolean;
};
export declare class PanTool extends BaseTool<PanToolOption> {
    static toolName: string;
    private _lastPoint;
    readonly panning$: Signal<boolean>;
    get allowDragWithRightButton(): boolean;
    dragEnd(_: PointerEventState): void;
    dragMove(e: PointerEventState): void;
    dragStart(e: PointerEventState): void;
    mounted(): void;
}
