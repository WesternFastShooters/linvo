import { defineCustomElement } from '@linvo-core/global/utils';
import { Slider } from './slider';
export * from './types';

export function effects() {
  defineCustomElement('linvo-slider', Slider);
}
