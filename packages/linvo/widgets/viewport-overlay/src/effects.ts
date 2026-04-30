import {
  LINVO_VIEWPORT_OVERLAY_WIDGET,
  LinvoViewportOverlayWidget,
} from './index';

export function effects() {
  customElements.define(
    LINVO_VIEWPORT_OVERLAY_WIDGET,
    LinvoViewportOverlayWidget
  );
}
