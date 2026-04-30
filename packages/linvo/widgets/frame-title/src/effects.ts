import {
  LINVO_FRAME_TITLE_WIDGET,
  LinvoFrameTitleWidget,
} from './linvo-frame-title-widget.js';
import { EdgelessFrameTitleEditor } from './edgeless-frame-title-editor.js';
import { LINVO_FRAME_TITLE, LinvoFrameTitle } from './frame-title.js';

export function effects() {
  customElements.define(LINVO_FRAME_TITLE_WIDGET, LinvoFrameTitleWidget);
  customElements.define(LINVO_FRAME_TITLE, LinvoFrameTitle);
  customElements.define(
    'edgeless-frame-title-editor',
    EdgelessFrameTitleEditor
  );
}
