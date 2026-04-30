import { LinvoText } from './nodes/linvo-text';

export function effects() {
  customElements.define('linvo-text', LinvoText);
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-text': LinvoText;
  }
}
