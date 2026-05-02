import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessTextEditor } from './edgeless-text-editor';
import { EdgelessTextMenu } from './toolbar/text-menu';

export function effects() {
  defineCustomElement('edgeless-text-editor', EdgelessTextEditor);
  defineCustomElement('edgeless-text-menu', EdgelessTextMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-text-editor': EdgelessTextEditor;
    'edgeless-text-menu': EdgelessTextMenu;
  }
}
