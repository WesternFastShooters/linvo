import { CardStyleDropdownMenu } from './dropdown-menu';

export * from './dropdown-menu';

export function effects() {
  customElements.define(
    'linvo-card-style-dropdown-menu',
    CardStyleDropdownMenu
  );
}
