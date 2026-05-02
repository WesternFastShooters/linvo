import { defineCustomElement } from '@linvo-core/global/utils';
import {
  LINVO_FRAME_TITLE_WIDGET,
  LinvoFrameTitleWidget,
} from './linvo-frame-title-widget';
import { EdgelessFrameTitleEditor } from './edgeless-frame-title-editor';
import { LINVO_FRAME_TITLE, LinvoFrameTitle } from './frame-title';

export function effects() {
  defineCustomElement(LINVO_FRAME_TITLE_WIDGET, LinvoFrameTitleWidget);
  defineCustomElement(LINVO_FRAME_TITLE, LinvoFrameTitle);
  defineCustomElement(
    'edgeless-frame-title-editor',
    EdgelessFrameTitleEditor
  );
}
