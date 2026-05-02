import { type ConnectorElementModel } from '@linvo-core/content';
import { type DragEndContext, type DragMoveContext, type DragStartContext, GfxElementModelView } from '@linvo-core/std/gfx';
export declare class ConnectorElementView extends GfxElementModelView<ConnectorElementModel> {
    static type: string;
    onDragStart: (context: DragStartContext) => void;
    onDragEnd: (context: DragEndContext) => void;
    onDragMove: (context: DragMoveContext) => void;
    onCreated(): void;
    private _initLabelMoving;
}
export declare const ConnectorInteraction: import("@linvo-core/composition").ExtensionType;
