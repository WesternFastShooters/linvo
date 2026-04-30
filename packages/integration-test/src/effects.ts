import '@linvo/linvo/effects';

import { TestLinvoEditorContainer } from './editors/index.js';

export function effects() {
  customElements.define('linvo-editor-container', TestLinvoEditorContainer);
}
