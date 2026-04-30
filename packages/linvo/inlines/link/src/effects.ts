import { LinvoLink } from './link-node/linvo-link';
import { LinkPopup } from './link-node/link-popup/link-popup';

export function effects() {
  customElements.define('link-popup', LinkPopup);
  customElements.define('linvo-link', LinvoLink);
}
