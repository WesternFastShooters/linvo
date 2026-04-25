import { DefaultTool } from '@blocksuite/affine-block-surface';
import {
  ExcalidrawSelectIcon,
  QuickToolMixin,
} from '@blocksuite/affine-widget-edgeless-toolbar';
import { css, html, LitElement } from 'lit';

export class EdgelessDefaultToolButton extends QuickToolMixin(LitElement) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  override type = DefaultTool;

  override render() {
    const { active } = this;
    return html`
      <edgeless-tool-icon-button
        class="edgeless-default-button"
        .tooltip=${html`<affine-tooltip-content-with-shortcut
          data-tip="${'Select'}"
          data-shortcut="${'V'}"
        ></affine-tooltip-content-with-shortcut>`}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${active}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'20px'}
        @click=${() => this.setEdgelessTool(DefaultTool)}
      >
        ${ExcalidrawSelectIcon()}
      </edgeless-tool-icon-button>
    `;
  }
}
