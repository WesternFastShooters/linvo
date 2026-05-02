import type { EditorHost } from '@linvo-core/std';

/**
 * Get editor viewport element.
 * @example
 * ```ts
 * const viewportElement = getViewportElement(this.model.doc);
 * if (!viewportElement) return;
 * this._disposables.addFromEvent(viewportElement, 'scroll', () => {
 *   updatePosition();
 * });
 * ```
 */
export function getViewportElement(editorHost: EditorHost) {
  return (
    editorHost.closest<HTMLElement>('.linvo-page-viewport') ??
    editorHost.closest<HTMLElement>('.linvo-edgeless-viewport')
  );
}
