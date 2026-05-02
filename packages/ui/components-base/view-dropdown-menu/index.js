import { defineCustomElement } from '@linvo-core/global/utils';
import { ViewDropdownMenu } from './dropdown-menu';
export * from './dropdown-menu';
export function effects() {
    defineCustomElement('linvo-view-dropdown-menu', ViewDropdownMenu);
}
