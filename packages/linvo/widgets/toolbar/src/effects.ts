import { LINVO_TOOLBAR_WIDGET, LinvoToolbarWidget } from './toolbar';

export function effects() {
  customElements.define(LINVO_TOOLBAR_WIDGET, LinvoToolbarWidget);
}

declare global {
  interface HTMLElementTagNameMap {
    [LINVO_TOOLBAR_WIDGET]: LinvoToolbarWidget;
  }
}
