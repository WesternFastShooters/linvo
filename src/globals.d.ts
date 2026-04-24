import type { EditorSetting } from '@blocksuite/affine/shared/services';
import type { TestAffineEditorContainer } from '@blocksuite/integration-test';
import type { Signal } from '@preact/signals-core';

declare global {
  interface Window {
    doc: unknown;
    editor: TestAffineEditorContainer;
    editorSetting$?: Signal<EditorSetting>;
    workspace: unknown;
  }
}

export {};
