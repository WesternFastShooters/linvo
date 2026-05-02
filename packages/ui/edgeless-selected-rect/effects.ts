import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessAutoCompletePanel } from './auto-complete-panel';
import { EdgelessAutoComplete } from './edgeless-auto-complete';
import {
  EDGELESS_SELECTED_RECT_WIDGET,
  EdgelessSelectedRectWidget,
} from './edgeless-selected-rect';

export function effects() {
  defineCustomElement(
    'edgeless-auto-complete-panel',
    EdgelessAutoCompletePanel
  );
  defineCustomElement('edgeless-auto-complete', EdgelessAutoComplete);
  defineCustomElement(
    EDGELESS_SELECTED_RECT_WIDGET,
    EdgelessSelectedRectWidget
  );
}
