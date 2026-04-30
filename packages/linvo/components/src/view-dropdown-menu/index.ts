import { ViewDropdownMenu } from './dropdown-menu';

export * from './dropdown-menu';

export function effects() {
  customElements.define('linvo-view-dropdown-menu', ViewDropdownMenu);
}
