import { defineCustomElement } from '@linvo-core/global/utils';
import { CardStyleDropdownMenu } from './dropdown-menu';
export * from './dropdown-menu';
export function effects() {
    defineCustomElement('linvo-card-style-dropdown-menu', CardStyleDropdownMenu);
}
