import { type ElementRenderer } from '@linvo-core/block-surface';
import type { GroupElementModel } from '@linvo-core/content';
export declare const group: ElementRenderer<GroupElementModel>;
export declare const GroupElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<GroupElementModel>>;
};
