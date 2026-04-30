import { LinvoMention } from './linvo-mention';

export function effects() {
  customElements.define('linvo-mention', LinvoMention);
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-mention': LinvoMention;
  }
}
