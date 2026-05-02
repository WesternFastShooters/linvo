import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessDefaultToolButton } from './quick-tool/default-tool-button';

export function effects() {
  defineCustomElement(
    'edgeless-default-tool-button',
    EdgelessDefaultToolButton
  );
}
