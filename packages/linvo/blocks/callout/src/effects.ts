import { CalloutBlockComponent } from './callout-block';
import { EmojiMenu } from './emoji-menu';

export function effects() {
  customElements.define('linvo-callout', CalloutBlockComponent);
  customElements.define('linvo-emoji-menu', EmojiMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-callout': CalloutBlockComponent;
    'linvo-emoji-menu': EmojiMenu;
  }
}
