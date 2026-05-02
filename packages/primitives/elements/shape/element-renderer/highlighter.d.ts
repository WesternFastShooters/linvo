import { type ElementRenderer } from '@linvo-core/block-surface';
import { type HighlighterElementModel } from '@linvo-core/content';
export declare const highlighter: ElementRenderer<HighlighterElementModel>;
export declare const HighlighterElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<HighlighterElementModel>>;
};
