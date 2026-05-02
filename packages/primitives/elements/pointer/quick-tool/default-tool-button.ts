import { DefaultTool } from '@linvo-core/block-surface';
import {
  ExcalidrawSelectIcon,
  QuickToolMixin,
} from '@linvo-ui/edgeless-toolbar';
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
        .tooltip=${html`<linvo-tooltip-content-with-shortcut
          data-tip="${'Select'}"
          data-shortcut="${'V'}"
        ></linvo-tooltip-content-with-shortcut>`}
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
