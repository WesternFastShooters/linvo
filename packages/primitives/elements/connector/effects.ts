import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessConnectorHandle } from './components/connector-handle';
import { EdgelessConnectorLabelEditor } from './text/edgeless-connector-label-editor';
import { EdgelessConnectorMenu } from './toolbar/connector-menu';
import { EdgelessConnectorToolButton } from './toolbar/connector-tool-button';

export function effects() {
  defineCustomElement(
    'edgeless-connector-tool-button',
    EdgelessConnectorToolButton
  );
  defineCustomElement('edgeless-connector-menu', EdgelessConnectorMenu);
  defineCustomElement(
    'edgeless-connector-label-editor',
    EdgelessConnectorLabelEditor
  );
  defineCustomElement('edgeless-connector-handle', EdgelessConnectorHandle);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-connector-tool-button': EdgelessConnectorToolButton;
    'edgeless-connector-menu': EdgelessConnectorMenu;
    'edgeless-connector-label-editor': EdgelessConnectorLabelEditor;
    'edgeless-connector-handle': EdgelessConnectorHandle;
  }
}
