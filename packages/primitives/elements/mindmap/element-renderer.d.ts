import { type ElementRenderer } from '@linvo-core/block-surface';
import type { MindmapElementModel } from '@linvo-core/content';
export declare const mindmap: ElementRenderer<MindmapElementModel>;
export declare const MindmapElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<MindmapElementModel>>;
};
