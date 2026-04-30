import type { EditorSetting } from '@linvo/linvo/shared/services';
import type { TestLinvoEditorContainer } from '@linvo/integration-test';
import type { Signal } from '@preact/signals-core';

type LinvoEditorContainer = TestLinvoEditorContainer;

declare global {
  interface Window {
    doc: unknown;
    editor: LinvoEditorContainer;
    editorSetting$?: Signal<EditorSetting>;
    workspace: unknown;
  }
}

export {};
