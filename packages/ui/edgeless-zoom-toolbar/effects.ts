import { defineCustomElement } from '@linvo-core/global/utils';
import {
  LINVO_EDGELESS_ZOOM_TOOLBAR_WIDGET,
  LinvoEdgelessZoomToolbarWidget,
} from '.';
import { ZoomBarToggleButton } from './zoom-bar-toggle-button';
import { EdgelessZoomToolbar } from './zoom-toolbar';

export function effects() {
  defineCustomElement('edgeless-zoom-toolbar', EdgelessZoomToolbar);
  defineCustomElement('zoom-bar-toggle-button', ZoomBarToggleButton);
  defineCustomElement(
    LINVO_EDGELESS_ZOOM_TOOLBAR_WIDGET,
    LinvoEdgelessZoomToolbarWidget
  );
}
