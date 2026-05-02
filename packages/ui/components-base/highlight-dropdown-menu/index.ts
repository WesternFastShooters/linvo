import { defineCustomElement } from '@linvo-core/global/utils';
import { HighlightDropdownMenu } from './dropdown-menu';
import { HighlightDuotoneIcon } from './highlight-duotone-icon';
import { TextDuotoneIcon } from './text-duotone-icon';

export * from './dropdown-menu';
export * from './highlight-duotone-icon';
export * from './text-duotone-icon';

export function effects() {
  defineCustomElement(
    'linvo-highlight-dropdown-menu',
    HighlightDropdownMenu
  );
  defineCustomElement('linvo-highlight-duotone-icon', HighlightDuotoneIcon);
  defineCustomElement('linvo-text-duotone-icon', TextDuotoneIcon);
}
