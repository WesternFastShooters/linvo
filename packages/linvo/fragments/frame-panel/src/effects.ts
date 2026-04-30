import {
  LINVO_FRAME_PANEL_BODY,
  FramePanelBody,
} from './body/frame-panel-body';
import { LINVO_FRAME_CARD, FrameCard } from './card/frame-card';
import {
  LINVO_FRAME_CARD_TITLE,
  FrameCardTitle,
} from './card/frame-card-title';
import {
  LINVO_FRAME_TITLE_EDITOR,
  FrameCardTitleEditor,
} from './card/frame-card-title-editor';
import { LINVO_FRAME_PREVIEW, FramePreview } from './card/frame-preview';
import { LINVO_FRAME_PANEL, FramePanel } from './frame-panel';
import {
  LINVO_FRAME_PANEL_HEADER,
  FramePanelHeader,
} from './header/frame-panel-header';
import {
  LINVO_FRAMES_SETTING_MENU,
  FramesSettingMenu,
} from './header/frames-setting-menu';

export function effects() {
  customElements.define(LINVO_FRAME_PANEL, FramePanel);
  customElements.define(LINVO_FRAME_TITLE_EDITOR, FrameCardTitleEditor);
  customElements.define(LINVO_FRAME_CARD, FrameCard);
  customElements.define(LINVO_FRAME_CARD_TITLE, FrameCardTitle);
  customElements.define(LINVO_FRAME_PANEL_BODY, FramePanelBody);
  customElements.define(LINVO_FRAME_PANEL_HEADER, FramePanelHeader);
  customElements.define(LINVO_FRAMES_SETTING_MENU, FramesSettingMenu);
  customElements.define(LINVO_FRAME_PREVIEW, FramePreview);
}
