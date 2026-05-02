import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessLineStylesPanel } from './line-styles-panel';

export * from './line-styles-panel';

export function effects() {
  defineCustomElement('edgeless-line-styles-panel', EdgelessLineStylesPanel);
}
