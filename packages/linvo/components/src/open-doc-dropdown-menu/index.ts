import { OpenDocDropdownMenu } from './dropdown-menu';

export * from './dropdown-menu';

export function effects() {
  customElements.define('linvo-open-doc-dropdown-menu', OpenDocDropdownMenu);
}
