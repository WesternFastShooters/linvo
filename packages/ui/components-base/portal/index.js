import { defineCustomElement } from '@linvo-core/global/utils';
export { createLitPortal, createSimplePortal } from './helper';
export { Portal } from './portal';
import { Portal } from './portal';
export function effects() {
    defineCustomElement('linvo-portal', Portal);
}
