import { defineCustomElement } from '@linvo-core/global/utils';

import { LinvoEditorContainer } from './editor-container';

export function installAppEffects() {
  defineCustomElement('linvo-editor-container', LinvoEditorContainer);
}
