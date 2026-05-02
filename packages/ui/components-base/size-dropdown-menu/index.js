import { defineCustomElement } from '@linvo-core/global/utils';
import { SizeDropdownMenu } from './dropdown-menu';
export * from './dropdown-menu';
export function effects() {
    defineCustomElement('linvo-size-dropdown-menu', SizeDropdownMenu);
}
