import {
  EDGELESS_DND_PREVIEW_ELEMENT,
  EdgelessDndPreviewElement,
} from './components/edgeless-preview/preview';
import { LINVO_DRAG_HANDLE_WIDGET } from './consts';
import { LinvoDragHandleWidget } from './drag-handle';

export function effects() {
  customElements.define(LINVO_DRAG_HANDLE_WIDGET, LinvoDragHandleWidget);
  customElements.define(
    EDGELESS_DND_PREVIEW_ELEMENT,
    EdgelessDndPreviewElement
  );
}
