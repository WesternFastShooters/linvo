import { GroupElementModel } from '@linvo-core/content';
import { GfxElementModelView } from '@linvo-core/std/gfx';
export declare class GroupElementView extends GfxElementModelView<GroupElementModel> {
    static type: string;
    onCreated(): void;
    private _initDblClickToEdit;
}
export declare const GroupInteraction: import("@linvo-core/composition").ExtensionType;
