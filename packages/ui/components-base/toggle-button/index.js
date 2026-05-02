import { defineCustomElement } from '@linvo-core/global/utils';
import { TOGGLE_BUTTON_PARENT_CLASS, ToggleButton } from './toggle-button';
export function effects() {
    defineCustomElement('linvo-toggle-button', ToggleButton);
}
export { TOGGLE_BUTTON_PARENT_CLASS, ToggleButton };
