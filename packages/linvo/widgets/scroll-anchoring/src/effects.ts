import {
  LINVO_SCROLL_ANCHORING_WIDGET,
  LinvoScrollAnchoringWidget,
} from './scroll-anchoring.js';

export function effects() {
  customElements.define(
    LINVO_SCROLL_ANCHORING_WIDGET,
    LinvoScrollAnchoringWidget
  );
}

declare global {
  interface HTMLElementTagNameMap {
    [LINVO_SCROLL_ANCHORING_WIDGET]: LinvoScrollAnchoringWidget;
  }
}
