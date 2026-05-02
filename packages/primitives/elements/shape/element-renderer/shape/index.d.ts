import { type ElementRenderer } from '@linvo-core/block-surface';
import type { ShapeElementModel } from '@linvo-core/content';
export declare const shape: ElementRenderer<ShapeElementModel>;
export declare const ShapeElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<ShapeElementModel>>;
};
export * from './utils';
