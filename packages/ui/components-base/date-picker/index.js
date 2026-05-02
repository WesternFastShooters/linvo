import { defineCustomElement } from '@linvo-core/global/utils';
import { DatePicker } from './date-picker';
export * from './date-picker';
export function effects() {
    defineCustomElement('date-picker', DatePicker);
}
