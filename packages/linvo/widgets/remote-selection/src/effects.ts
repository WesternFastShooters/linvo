import { LINVO_DOC_REMOTE_SELECTION_WIDGET } from './doc';
import { LinvoDocRemoteSelectionWidget } from './doc/doc-remote-selection';
import {
  LINVO_EDGELESS_REMOTE_SELECTION_WIDGET,
  EdgelessRemoteSelectionWidget,
} from './edgeless';

export function effects() {
  customElements.define(
    LINVO_DOC_REMOTE_SELECTION_WIDGET,
    LinvoDocRemoteSelectionWidget
  );
  customElements.define(
    LINVO_EDGELESS_REMOTE_SELECTION_WIDGET,
    EdgelessRemoteSelectionWidget
  );
}
