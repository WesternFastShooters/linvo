import type { NoteBlockModel } from '@linvo/linvo-model';
import { createDefaultDoc } from '@linvo/linvo-shared/utils';
import type { EditorHost } from '@linvo/std';
import type { GfxModel } from '@linvo/std/gfx';
import type { Store } from '@linvo/store';

export function createLinkedDocFromNote(
  doc: Store,
  _note: NoteBlockModel,
  docTitle?: string
) {
  return createDefaultDoc(doc.workspace, {
    title: docTitle,
  });
}

export function createLinkedDocFromEdgelessElements(
  host: EditorHost,
  _elements: GfxModel[],
  docTitle?: string
) {
  return createDefaultDoc(host.store.workspace, {
    title: docTitle,
  });
}
