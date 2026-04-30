import { LINVO_SLASH_MENU_WIDGET } from './consts';
import { InnerSlashMenu, SlashMenu } from './slash-menu-popover';
import { LinvoSlashMenuWidget } from './widget';

export function effects() {
  customElements.define(LINVO_SLASH_MENU_WIDGET, LinvoSlashMenuWidget);
  customElements.define('linvo-slash-menu', SlashMenu);
  customElements.define('inner-slash-menu', InnerSlashMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    [LINVO_SLASH_MENU_WIDGET]: LinvoSlashMenuWidget;
  }
}
