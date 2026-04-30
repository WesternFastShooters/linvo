import type { EditorHost } from '@linvo/std';

export function isInsidePageEditor(host?: EditorHost) {
  if (!host) return false;
  return Array.from(host.children).some(
    v => v.tagName.toLowerCase() === 'linvo-page-root'
  );
}

export function isInsideEdgelessEditor(host?: EditorHost) {
  if (!host) return false;

  return Array.from(host.children).some(
    v =>
      v.tagName.toLowerCase() === 'linvo-edgeless-root' ||
      v.tagName.toLowerCase() === 'linvo-edgeless-root-preview'
  );
}
