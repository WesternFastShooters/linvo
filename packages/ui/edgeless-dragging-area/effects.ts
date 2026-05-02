import { defineCustomElement } from '@linvo-core/global/utils';
import {
  EDGELESS_DRAGGING_AREA_WIDGET,
  EdgelessDraggingAreaRectWidget,
} from './edgeless-dragging-area-rect';
import {
  EDGELESS_LASSO_DRAGGING_AREA_WIDGET,
  EdgelessLassoDraggingAreaWidget,
} from './edgeless-lasso-dragging-area';

export function effects() {
  defineCustomElement(
    EDGELESS_DRAGGING_AREA_WIDGET,
    EdgelessDraggingAreaRectWidget
  );
  defineCustomElement(
    EDGELESS_LASSO_DRAGGING_AREA_WIDGET,
    EdgelessLassoDraggingAreaWidget
  );
}
