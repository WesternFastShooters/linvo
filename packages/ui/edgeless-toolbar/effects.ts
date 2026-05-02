import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessToolIconButton } from './button/tool-icon-button';
import { EdgelessToolbarButton } from './button/toolbar-button';
import {
  EDGELESS_TOOLBAR_WIDGET,
  EdgelessToolbarWidget,
} from './edgeless-toolbar';
import { EdgelessSlideMenu } from './menu/slide-menu';
import { ToolbarArrowUpIcon } from './menu/toolbar-arrow-up-icon';
import { EdgelessFontFamilyPanel } from './panel/font-family-panel';
import { EdgelessFontWeightAndStylePanel } from './panel/font-weight-and-style-panel';
import { EdgelessFileToolButton } from './file-tool-button';
import { EdgelessWebPreviewToolButton } from './web-preview-tool-button';
import { EdgelessWebPreviewUrlModal } from './web-preview-url-modal';

export function effects() {
  defineCustomElement(EDGELESS_TOOLBAR_WIDGET, EdgelessToolbarWidget);
  defineCustomElement('edgeless-toolbar-button', EdgelessToolbarButton);
  defineCustomElement('edgeless-tool-icon-button', EdgelessToolIconButton);
  defineCustomElement(
    'edgeless-font-weight-and-style-panel',
    EdgelessFontWeightAndStylePanel
  );
  defineCustomElement('edgeless-font-family-panel', EdgelessFontFamilyPanel);
  defineCustomElement('edgeless-slide-menu', EdgelessSlideMenu);
  defineCustomElement('edgeless-file-tool-button', EdgelessFileToolButton);
  defineCustomElement(
    'edgeless-web-preview-tool-button',
    EdgelessWebPreviewToolButton
  );
  defineCustomElement(
    'edgeless-web-preview-url-modal',
    EdgelessWebPreviewUrlModal
  );
  defineCustomElement('toolbar-arrow-up-icon', ToolbarArrowUpIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-tool-icon-button': EdgelessToolIconButton;
    'edgeless-toolbar-button': EdgelessToolbarButton;
    'edgeless-toolbar-widget': EdgelessToolbarWidget;
    'edgeless-font-weight-and-style-panel': EdgelessFontWeightAndStylePanel;
    'edgeless-font-family-panel': EdgelessFontFamilyPanel;
    'edgeless-slide-menu': EdgelessSlideMenu;
    'edgeless-file-tool-button': EdgelessFileToolButton;
    'edgeless-web-preview-tool-button': EdgelessWebPreviewToolButton;
    'edgeless-web-preview-url-modal': EdgelessWebPreviewUrlModal;
    'toolbar-arrow-up-icon': ToolbarArrowUpIcon;
  }
}
