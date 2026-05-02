import type { EditorSetting } from '@linvo-core/shared/services';
import type { Signal } from '@preact/signals-core';

import type { LinvoEditorContainerElement } from './editor-element';

type LinvoEditorContainer = LinvoEditorContainerElement;

declare global {
  interface Window {
    editor: LinvoEditorContainer;
    editorSetting$?: Signal<EditorSetting>;
    whiteboardDataSource: unknown;
    whiteboardRecord: unknown;
    whiteboardStore: unknown;
  }
}

export {};
