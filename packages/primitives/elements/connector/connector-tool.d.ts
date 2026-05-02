import { ConnectorMode } from '@linvo-core/content';
import type { IVec } from '@linvo-core/global/gfx';
import type { PointerEventState } from '@linvo-core/std';
import { BaseTool, type GfxModel } from '@linvo-core/std/gfx';
export type ConnectorToolOptions = {
    mode: ConnectorMode;
};
export declare class ConnectorTool extends BaseTool<ConnectorToolOptions> {
    static toolName: string;
    private _allowCancel;
    private _connector;
    private _mode;
    private _source;
    private _sourceBounds;
    private _sourceLocations;
    private _startPoint;
    private get _overlay();
    private _createConnector;
    click(): void;
    deactivate(): void;
    dragEnd(): void;
    dragMove(e: PointerEventState): void;
    dragStart(): void;
    findTargetByPoint(point: IVec): void;
    pointerDown(e: PointerEventState): void;
    pointerMove(e: PointerEventState): void;
    pointerUp(_: PointerEventState): void;
    quickConnect(point: IVec, element: GfxModel): void;
    getNextMode(): ConnectorMode;
}
