import { LINVO_OUTLINE_NOTICE, OutlineNotice } from './body/outline-notice';
import {
  LINVO_OUTLINE_PANEL_BODY,
  OutlinePanelBody,
} from './body/outline-panel-body';
import { LINVO_OUTLINE_NOTE_CARD, OutlineNoteCard } from './card/outline-card';
import {
  LINVO_OUTLINE_BLOCK_PREVIEW,
  OutlineBlockPreview,
} from './card/outline-preview';
import {
  LINVO_OUTLINE_PANEL_HEADER,
  OutlinePanelHeader,
} from './header/outline-panel-header';
import {
  LINVO_OUTLINE_NOTE_PREVIEW_SETTING_MENU,
  OutlineNotePreviewSettingMenu,
} from './header/outline-setting-menu';
import {
  LINVO_MOBILE_OUTLINE_MENU,
  MobileOutlineMenu,
} from './mobile-outline-panel';
import { LINVO_OUTLINE_PANEL, OutlinePanel } from './outline-panel';
import { LINVO_OUTLINE_VIEWER, OutlineViewer } from './outline-viewer';

export function effects() {
  customElements.define(
    LINVO_OUTLINE_NOTE_PREVIEW_SETTING_MENU,
    OutlineNotePreviewSettingMenu
  );
  customElements.define(LINVO_OUTLINE_NOTICE, OutlineNotice);
  customElements.define(LINVO_OUTLINE_PANEL, OutlinePanel);
  customElements.define(LINVO_OUTLINE_PANEL_HEADER, OutlinePanelHeader);
  customElements.define(LINVO_OUTLINE_NOTE_CARD, OutlineNoteCard);
  customElements.define(LINVO_OUTLINE_VIEWER, OutlineViewer);
  customElements.define(LINVO_MOBILE_OUTLINE_MENU, MobileOutlineMenu);
  customElements.define(LINVO_OUTLINE_BLOCK_PREVIEW, OutlineBlockPreview);
  customElements.define(LINVO_OUTLINE_PANEL_BODY, OutlinePanelBody);
}
