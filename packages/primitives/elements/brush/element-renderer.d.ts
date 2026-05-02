import { type ElementRenderer } from '@linvo-core/block-surface';
import { type BrushElementModel } from '@linvo-core/content';
export declare const brush: ElementRenderer<BrushElementModel>;
export declare const BrushElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<BrushElementModel>>;
};
