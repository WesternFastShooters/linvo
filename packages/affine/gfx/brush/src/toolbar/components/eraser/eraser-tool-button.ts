import { DefaultTool } from '@blocksuite/affine-block-surface';
import {
  EdgelessToolbarToolMixin,
  ExcalidrawEraserIcon,
} from '@blocksuite/affine-widget-edgeless-toolbar';
import { css, html, LitElement } from 'lit';

import { EraserTool } from '../../../eraser-tool';

export class EdgelessEraserToolButton extends EdgelessToolbarToolMixin(
  LitElement
) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  override enableActiveBackground = true;

  override type = EraserTool;

  override firstUpdated() {
    this.disposables.add(
      this.edgeless.bindHotKey(
        {
          Escape: () => {
            if (this.edgelessTool.toolType === EraserTool) {
              this.setEdgelessTool(DefaultTool);
            }
          },
        },
        { global: true }
      )
    );
  }

  override render() {
    const type = this.edgelessTool?.toolType;

    return html`
      <edgeless-tool-icon-button
        class="edgeless-eraser-button"
        .tooltip=${html`<affine-tooltip-content-with-shortcut
          data-tip="${'Eraser'}"
          data-shortcut="${'E'}"
        ></affine-tooltip-content-with-shortcut>`}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${type === EraserTool}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'20px'}
        @click=${() => this.setEdgelessTool(EraserTool)}
      >
        ${ExcalidrawEraserIcon()}
      </edgeless-tool-icon-button>
    `;
  }
}
