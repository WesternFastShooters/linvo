import { defineCustomElement } from '@linvo-core/global/utils';
import { GfxViewportElement } from './gfx/viewport-element';
import { VElement, VLine, VText } from './inline';
import { EditorHost } from './dom';

export function effects() {
  // editor host
  defineCustomElement('editor-host', EditorHost);
  // gfx
  defineCustomElement('gfx-viewport', GfxViewportElement);
  // inline
  defineCustomElement('v-element', VElement);
  defineCustomElement('v-line', VLine);
  defineCustomElement('v-text', VText);
}
