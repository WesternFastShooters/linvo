import { LinvoReference, ReferencePopup } from './reference-node';

export function effects() {
  customElements.define('reference-popup', ReferencePopup);
  customElements.define('linvo-reference', LinvoReference);
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-reference': LinvoReference;
    'reference-popup': ReferencePopup;
  }
}
