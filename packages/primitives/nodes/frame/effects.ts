import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessFrameMenu, EdgelessFrameToolButton } from './edgeless-toolbar';
import { PresentationToolbar } from './edgeless-toolbar/presentation-toolbar';
import { FrameBlockComponent } from './frame-block';
import { EdgelessFrameOrderButton } from './present/frame-order-button';
import { EdgelessFrameOrderMenu } from './present/frame-order-menu';
import {
  EDGELESS_NAVIGATOR_BLACK_BACKGROUND_WIDGET,
  EdgelessNavigatorBlackBackgroundWidget,
} from './present/navigator-bg-widget';
import { EdgelessNavigatorSettingButton } from './present/navigator-setting-button';
import { EdgelessPresentButton } from './present/present-button';

export function effects() {
  defineCustomElement('linvo-frame', FrameBlockComponent);
  defineCustomElement('edgeless-frame-tool-button', EdgelessFrameToolButton);
  defineCustomElement('edgeless-frame-menu', EdgelessFrameMenu);
  defineCustomElement(
    'edgeless-frame-order-button',
    EdgelessFrameOrderButton
  );
  defineCustomElement('edgeless-frame-order-menu', EdgelessFrameOrderMenu);
  defineCustomElement(
    'edgeless-navigator-setting-button',
    EdgelessNavigatorSettingButton
  );
  defineCustomElement('edgeless-present-button', EdgelessPresentButton);
  defineCustomElement('presentation-toolbar', PresentationToolbar);
  // Navigation components
  defineCustomElement(
    EDGELESS_NAVIGATOR_BLACK_BACKGROUND_WIDGET,
    EdgelessNavigatorBlackBackgroundWidget
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-frame': FrameBlockComponent;
    'edgeless-frame-tool-button': EdgelessFrameToolButton;
    'edgeless-frame-menu': EdgelessFrameMenu;
    'edgeless-frame-order-button': EdgelessFrameOrderButton;
    'edgeless-frame-order-menu': EdgelessFrameOrderMenu;
    'edgeless-navigator-setting-button': EdgelessNavigatorSettingButton;
    'edgeless-present-button': EdgelessPresentButton;
    'presentation-toolbar': PresentationToolbar;
    'edgeless-navigator-black-background': EdgelessNavigatorBlackBackgroundWidget;
  }
}
