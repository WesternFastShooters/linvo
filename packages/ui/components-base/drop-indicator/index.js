import { defineCustomElement } from '@linvo-core/global/utils';
import { DropIndicator } from './drop-indicator';
export { FileDropConfigExtension, FileDropExtension, } from './file-drop-manager';
export { DropIndicator };
export function effects() {
    defineCustomElement('linvo-drop-indicator', DropIndicator);
}
