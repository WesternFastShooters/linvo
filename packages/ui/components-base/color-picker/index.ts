import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessColorPickerButton } from './button';
import {
  EdgelessColorButton,
  EdgelessColorPanel,
  EdgelessTextColorIcon,
} from './color-panel';
import { EdgelessColorPicker } from './color-picker';
import { EdgelessColorCustomButton } from './custom-button';

export * from './button';
export * from './color-panel';
export * from './color-picker';
export * from './types';
export * from './utils';

export function effects() {
  defineCustomElement('edgeless-color-picker', EdgelessColorPicker);
  defineCustomElement(
    'edgeless-color-picker-button',
    EdgelessColorPickerButton
  );
  defineCustomElement(
    'edgeless-color-custom-button',
    EdgelessColorCustomButton
  );
  defineCustomElement('edgeless-color-button', EdgelessColorButton);
  defineCustomElement('edgeless-color-panel', EdgelessColorPanel);
  defineCustomElement('edgeless-text-color-icon', EdgelessTextColorIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-color-picker-button': EdgelessColorPickerButton;
    'edgeless-color-picker': EdgelessColorPicker;
    'edgeless-color-custom-button': EdgelessColorCustomButton;

    'edgeless-color-panel': EdgelessColorPanel;
    'edgeless-color-button': EdgelessColorButton;
    'edgeless-text-color-icon': EdgelessTextColorIcon;
  }
}
