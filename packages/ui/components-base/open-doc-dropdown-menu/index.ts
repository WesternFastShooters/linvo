import { defineCustomElement } from '@linvo-core/global/utils';
import { OpenDocDropdownMenu } from './dropdown-menu';

export * from './dropdown-menu';

export function effects() {
  defineCustomElement('linvo-open-doc-dropdown-menu', OpenDocDropdownMenu);
}
