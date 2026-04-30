import { LINVO_LINKED_DOC_WIDGET } from './config.js';
import { ImportDoc } from './import-doc/import-doc.js';
import { Loader } from './import-doc/loader.js';
import { LinvoLinkedDocWidget } from './index.js';
import { LinkedDocPopover } from './linked-doc-popover.js';
import { LinvoMobileLinkedDocMenu } from './mobile-linked-doc-menu.js';

export function effects() {
  customElements.define('linvo-linked-doc-popover', LinkedDocPopover);
  customElements.define(LINVO_LINKED_DOC_WIDGET, LinvoLinkedDocWidget);
  customElements.define('import-doc', ImportDoc);
  customElements.define(
    'linvo-mobile-linked-doc-menu',
    LinvoMobileLinkedDocMenu
  );
  customElements.define('loader-element', Loader);
}
