import type { DocMode } from '@linvo-core/content';
import type { ExtensionType, Store } from '@linvo-core/store';

import type { LinvoEditorContainer } from './editor-container';

export type LinvoEditorContainerElement = LinvoEditorContainer &
  HTMLElement & {
    autofocus: boolean;
    doc: Store;
    edgelessSpecs: ExtensionType[];
    mode: DocMode;
    pageSpecs: ExtensionType[];
    std: {
      get<T>(token: unknown): T;
    };
    switchEditor(mode: DocMode): void;
    updateComplete: Promise<unknown>;
  };
