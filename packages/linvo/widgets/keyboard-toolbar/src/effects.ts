import {
  LINVO_KEYBOARD_TOOLBAR_WIDGET,
  LinvoKeyboardToolbarWidget,
} from './index.js';
import {
  LINVO_KEYBOARD_TOOL_PANEL,
  LinvoKeyboardToolPanel,
} from './keyboard-tool-panel.js';
import {
  LINVO_KEYBOARD_TOOLBAR,
  LinvoKeyboardToolbar,
} from './keyboard-toolbar.js';

export function effects() {
  customElements.define(
    LINVO_KEYBOARD_TOOLBAR_WIDGET,
    LinvoKeyboardToolbarWidget
  );
  customElements.define(LINVO_KEYBOARD_TOOLBAR, LinvoKeyboardToolbar);
  customElements.define(LINVO_KEYBOARD_TOOL_PANEL, LinvoKeyboardToolPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    [LINVO_KEYBOARD_TOOLBAR]: LinvoKeyboardToolbar;
    [LINVO_KEYBOARD_TOOL_PANEL]: LinvoKeyboardToolPanel;
  }
}
