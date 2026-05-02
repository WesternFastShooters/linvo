import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessGroupTitleEditor } from './text/edgeless-group-title-editor';

export function effects() {
  defineCustomElement(
    'edgeless-group-title-editor',
    EdgelessGroupTitleEditor
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-group-title-editor': EdgelessGroupTitleEditor;
  }
}
