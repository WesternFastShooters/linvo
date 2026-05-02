import { DomElementRendererExtension } from '@linvo-core/block-surface';
import { connectorDomRenderer } from './connector-dom';
/**
 * Extension to register the DOM-based renderer for 'connector' elements.
 */
export const ConnectorDomRendererExtension = DomElementRendererExtension('connector', connectorDomRenderer);
