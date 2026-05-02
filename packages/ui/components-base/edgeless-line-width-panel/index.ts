import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessLineWidthPanel } from './line-width-panel';

export * from './line-width-panel';

export function effects() {
  defineCustomElement('edgeless-line-width-panel', EdgelessLineWidthPanel);
}
