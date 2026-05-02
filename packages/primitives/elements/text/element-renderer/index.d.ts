import { type ElementRenderer } from '@linvo-core/block-surface';
import { type TextElementModel } from '@linvo-core/content';
export declare const text: ElementRenderer<TextElementModel>;
export declare const TextElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<TextElementModel>>;
};
export * from './utils';
