import type { EditorHost } from '@linvo/std';

import type { DocTitle } from './doc-title';

export function getDocTitleByEditorHost(
  editorHost: EditorHost
): DocTitle | null {
  const docViewport = editorHost.closest('.linvo-page-viewport');
  if (!docViewport) return null;
  return docViewport.querySelector('doc-title');
}
