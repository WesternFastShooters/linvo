import { DomElementRendererExtension } from '@linvo-core/block-surface';

import { shapeDomRenderer } from './shape-dom';

/**
 * Extension to register the DOM-based renderer for 'shape' elements.
 */
export const ShapeDomRendererExtension = DomElementRendererExtension(
  'shape',
  shapeDomRenderer
);
