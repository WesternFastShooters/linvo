import type {
  EdgelessRootBlockComponent,
  PreviewRootBlockComponent,
} from '@linvo/linvo/blocks/root';
import type { SurfaceBlockComponent } from '@linvo/linvo/blocks/surface';
import type { Store } from '@linvo/store';

import type { TestLinvoEditorContainer } from '../../index.js';

export function getSurface(doc: Store, editor: TestLinvoEditorContainer) {
  const surfaceModel = doc.getModelsByFlavour('linvo:surface');

  return editor.host!.view.getBlock(
    surfaceModel[0]!.id
  ) as SurfaceBlockComponent;
}

export function getDocRootBlock(
  doc: Store,
  editor: TestLinvoEditorContainer,
  mode: 'page'
): PreviewRootBlockComponent;
export function getDocRootBlock(
  doc: Store,
  editor: TestLinvoEditorContainer,
  mode: 'edgeless'
): EdgelessRootBlockComponent;
export function getDocRootBlock(
  doc: Store,
  editor: TestLinvoEditorContainer,
  _?: 'edgeless' | 'page'
) {
  return editor.host!.view.getBlock(doc.root!.id) as
    | EdgelessRootBlockComponent
    | PreviewRootBlockComponent;
}

export function addNote(doc: Store, props: Record<string, any> = {}) {
  const noteId = doc.addBlock(
    'linvo:note',
    {
      xywh: '[0, 0, 800, 100]',
      ...props,
    },
    doc.root
  );

  doc.addBlock('linvo:paragraph', {}, noteId);

  return noteId;
}
