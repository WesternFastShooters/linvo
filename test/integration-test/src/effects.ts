import { defineCustomElement } from '@linvo-core/global/utils';

import { TestLinvoEditorContainer } from './editors';

export function effects() {
  defineCustomElement('test-linvo-editor-container', TestLinvoEditorContainer);
}
