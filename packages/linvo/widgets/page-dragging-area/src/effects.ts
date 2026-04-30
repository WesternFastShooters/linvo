import {
  LINVO_PAGE_DRAGGING_AREA_WIDGET,
  LinvoPageDraggingAreaWidget,
} from './index';

export function effects() {
  customElements.define(
    LINVO_PAGE_DRAGGING_AREA_WIDGET,
    LinvoPageDraggingAreaWidget
  );
}
