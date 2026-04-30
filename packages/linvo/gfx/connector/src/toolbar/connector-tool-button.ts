import { ConnectorMode, getConnectorModeName } from '@linvo/linvo-model';
import { EditPropsStore } from '@linvo/linvo-shared/services';
import {
  ExcalidrawChevronDownIcon,
  ExcalidrawCurveIcon,
  QuickToolMixin,
} from '@linvo/linvo-widget-edgeless-toolbar';
import { SignalWatcher } from '@linvo/global/lit';
import { computed } from '@preact/signals-core';
import { css, html, LitElement } from 'lit';

import { ConnectorTool } from '../connector-tool';

export class EdgelessConnectorToolButton extends QuickToolMixin(
  SignalWatcher(LitElement)
) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  private readonly _mode$ = computed(() => {
    return this.edgeless.std.get(EditPropsStore).lastProps$.value.connector
      .mode;
  });

  override type = ConnectorTool;

  private _toggleMenu() {
    if (this.tryDisposePopper()) return;

    const menu = this.createPopper('edgeless-connector-menu', this);
    menu.element.edgeless = this.edgeless;
    menu.element.onChange = (props: Record<string, unknown>) => {
      this.edgeless.std.get(EditPropsStore).recordLastProps('connector', props);
      this.setEdgelessTool(this.type, {
        mode: this._mode$.value,
      });
    };
  }

  override render() {
    const { active } = this;
    const mode = this._mode$.value;
    return html`
      <edgeless-tool-icon-button
        class="edgeless-connector-button"
        .tooltip=${this.popper
          ? ''
          : html`<linvo-tooltip-content-with-shortcut
              data-tip="${getConnectorModeName(mode)}"
              data-shortcut="${'C'}"
            ></linvo-tooltip-content-with-shortcut>`}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${active}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'20px'}
        @click=${() => {
          // don't update tool before toggling menu
          this._toggleMenu();
          this.gfx.tool.setTool(ConnectorTool, {
            mode,
          });
        }}
      >
        ${ExcalidrawCurveIcon()} ${ExcalidrawChevronDownIcon()}
      </edgeless-tool-icon-button>
    `;
  }
}
