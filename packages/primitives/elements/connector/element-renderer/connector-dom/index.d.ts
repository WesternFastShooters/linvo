import type { DomRenderer } from '@linvo-core/block-surface';
import { type ConnectorElementModel } from '@linvo-core/content';
/**
 * Renders a ConnectorElementModel to a given HTMLElement using DOM/SVG.
 * This function is intended to be registered via the DomElementRendererExtension.
 *
 * @param model - The connector element model containing rendering properties.
 * @param element - The HTMLElement to apply the connector's styles to.
 * @param renderer - The main DOMRenderer instance, providing access to viewport and color utilities.
 */
export declare const connectorDomRenderer: (model: ConnectorElementModel, element: HTMLElement, renderer: DomRenderer) => void;
