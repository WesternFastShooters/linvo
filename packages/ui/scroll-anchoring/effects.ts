import { defineCustomElement } from '@linvo-core/global/utils';
import {
  LINVO_SCROLL_ANCHORING_WIDGET,
  LinvoScrollAnchoringWidget,
} from './scroll-anchoring';

export function effects() {
  defineCustomElement(
    LINVO_SCROLL_ANCHORING_WIDGET,
    LinvoScrollAnchoringWidget
  );
}

declare global {
  interface HTMLElementTagNameMap {
    [LINVO_SCROLL_ANCHORING_WIDGET]: LinvoScrollAnchoringWidget;
  }
}
