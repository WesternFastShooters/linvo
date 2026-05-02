import { ShapeElementModel } from '@linvo-core/content';
import { GfxElementModelView } from '@linvo-core/std/gfx';
export declare class ShapeElementView extends GfxElementModelView<ShapeElementModel> {
    static type: string;
    onCreated(): void;
    private _initDblClickToEdit;
}
export declare const ShapeViewInteraction: import("@linvo-core/composition").ExtensionType;
