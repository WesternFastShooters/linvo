import { defineCustomElement } from '@linvo-core/global/utils';
import {
  LINVO_VIEWPORT_OVERLAY_WIDGET,
  LinvoViewportOverlayWidget,
} from '.';

export function effects() {
  defineCustomElement(
    LINVO_VIEWPORT_OVERLAY_WIDGET,
    LinvoViewportOverlayWidget
  );
}
