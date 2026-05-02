import { type ElementRenderer } from '@linvo-core/block-surface';
import { type ConnectorElementModel, type LocalConnectorElementModel } from '@linvo-core/content';
export declare const connector: ElementRenderer<ConnectorElementModel | LocalConnectorElementModel>;
export declare const ConnectorElementRendererExtension: import("@linvo-core/composition").ExtensionType & {
    identifier: import("@linvo-core/composition/di").ServiceIdentifier<ElementRenderer<ConnectorElementModel | LocalConnectorElementModel>>;
};
