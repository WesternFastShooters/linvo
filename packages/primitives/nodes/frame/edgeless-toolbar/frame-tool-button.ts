import {
  ExcalidrawChevronDownIcon,
  ExcalidrawFrameIcon,
  QuickToolMixin,
} from '@linvo-ui/edgeless-toolbar';
import { css, html, LitElement } from 'lit';

import { FrameTool } from '../frame-tool';
import type { EdgelessFrameMenu } from './frame-menu';

export class EdgelessFrameToolButton extends QuickToolMixin(LitElement) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  override type = FrameTool;

  private _toggleFrameMenu() {
    if (this.tryDisposePopper()) return;

    this.createPopper('edgeless-frame-menu' as keyof HTMLElementTagNameMap, this, {
      setProps: menu => {
        (menu as EdgelessFrameMenu).edgeless = this.edgeless;
      },
    });
  }

  override render() {
    const type = this.edgelessTool?.toolType?.toolName;
    return html`
      <edgeless-tool-icon-button
        class="edgeless-frame-button"
        .tooltip=${this.popper
          ? ''
          : html`<linvo-tooltip-content-with-shortcut
              data-tip="${'Frame'}"
              data-shortcut="${'F'}"
            ></linvo-tooltip-content-with-shortcut>`}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .iconSize=${'20px'}
        .active=${type === 'frame'}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        @click=${() => {
          // don't update tool before toggling menu
          this._toggleFrameMenu();
          this.setEdgelessTool(FrameTool);
        }}
      >
        ${ExcalidrawFrameIcon()} ${ExcalidrawChevronDownIcon()}
      </edgeless-tool-icon-button>
    `;
  }
}
