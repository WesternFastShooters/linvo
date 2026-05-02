import type { TextElementModel } from '@linvo-core/content';
import { GfxElementModelView } from '@linvo-core/std/gfx';
export declare class TextElementView extends GfxElementModelView<TextElementModel> {
    static type: string;
    onCreated(): void;
    private _initDblClickToEdit;
}
export declare const TextInteraction: import("@linvo-core/composition").ExtensionType;
