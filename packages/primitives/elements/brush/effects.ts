import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessEraserToolButton } from './toolbar/components/eraser/eraser-tool-button';
import { EdgelessPenMenu } from './toolbar/components/pen/pen-menu';
import { EdgelessPenToolButton } from './toolbar/components/pen/pen-tool-button';

export function effects() {
  defineCustomElement(
    'edgeless-eraser-tool-button',
    EdgelessEraserToolButton
  );
  defineCustomElement('edgeless-pen-tool-button', EdgelessPenToolButton);
  defineCustomElement('edgeless-pen-menu', EdgelessPenMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-pen-menu': EdgelessPenMenu;
    'edgeless-pen-tool-button': EdgelessPenToolButton;
    'edgeless-eraser-tool-button': EdgelessEraserToolButton;
  }
}
