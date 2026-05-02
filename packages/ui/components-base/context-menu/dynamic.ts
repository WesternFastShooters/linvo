import { html, type TemplateResult } from 'lit';

import type { MenuConfig } from './menu';
import type { MenuItemRender } from './types';

export const menuDynamicItems = {
  dynamic: (config: () => MenuConfig[]) => menu => {
    const items = menu.renderItems(config());
    if (!items.length) {
      return;
    }
    const result: TemplateResult = html`${items}`;
    return result;
  },
} satisfies Record<string, MenuItemRender<never>>;
