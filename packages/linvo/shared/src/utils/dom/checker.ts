import type { EditorHost } from '@linvo/std';

export function isInsidePageEditor(host?: EditorHost) {
  if (!host) return false;
  return Array.from(host.children).some(v => {
    const tagName = v.tagName.toLowerCase();
    return (
      tagName === 'linvo-preview-root' || v.classList.contains('linvo-page-viewport')
    );
  });
}

export function isInsideEdgelessEditor(host?: EditorHost) {
  if (!host) return false;

  return Array.from(host.children).some(
    v =>
      v.tagName.toLowerCase() === 'linvo-edgeless-root' ||
      v.tagName.toLowerCase() === 'linvo-edgeless-root-preview'
  );
}
