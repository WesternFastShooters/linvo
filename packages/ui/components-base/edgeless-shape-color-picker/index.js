import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessShapeColorPicker } from './color-picker';
export * from './color-picker';
export function effects() {
    defineCustomElement('edgeless-shape-color-picker', EdgelessShapeColorPicker);
}
