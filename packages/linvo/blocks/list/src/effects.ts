import { ListBlockComponent } from './list-block.js';

export function effects() {
  customElements.define('linvo-list', ListBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-list': ListBlockComponent;
  }
}
