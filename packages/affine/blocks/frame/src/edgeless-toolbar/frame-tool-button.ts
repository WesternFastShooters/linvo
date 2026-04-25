import {
  ExcalidrawChevronDownIcon,
  ExcalidrawFrameIcon,
  QuickToolMixin,
} from '@blocksuite/affine-widget-edgeless-toolbar';
import { css, html, LitElement } from 'lit';

import { FrameTool } from '../frame-tool';

export class EdgelessFrameToolButton extends QuickToolMixin(LitElement) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  override type = FrameTool;

  private _toggleFrameMenu() {
    if (this.tryDisposePopper()) return;

    const menu = this.createPopper('edgeless-frame-menu', this);
    menu.element.edgeless = this.edgeless;
  }

  override render() {
    const type = this.edgelessTool?.toolType?.toolName;
    return html`
      <edgeless-tool-icon-button
        class="edgeless-frame-button"
        .tooltip=${this.popper
          ? ''
          : html`<affine-tooltip-content-with-shortcut
              data-tip="${'Frame'}"
              data-shortcut="${'F'}"
            ></affine-tooltip-content-with-shortcut>`}
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
