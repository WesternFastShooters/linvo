import { unsafeCSSVarV2 } from '@linvo/linvo-shared/theme';
import { IS_MOBILE } from '@linvo/global/env';
import { PlusIcon } from '@linvo/icons/lit';
import { css, html } from 'lit';

import { WidgetBase } from '../../../../core/widget/widget-base.js';

const styles = css`
  .new-record {
    font-weight: 500;
  }

  .new-record svg {
    font-size: 20px;
    color: ${unsafeCSSVarV2('icon/primary')};
  }
`;

export class DataViewHeaderToolsAddRow extends WidgetBase {
  static override styles = styles;

  private readonly onAddNewRecord = () => {
    if (this.readonly$.value) return;
    this.dataViewLogic.addRow?.('start');
  };

  private get readonly$() {
    return this.view.readonly$;
  }

  override render() {
    if (this.readonly$.value) {
      return;
    }
    return html` <data-view-component-button
      class="linvo-database-toolbar-item new-record"
      .onClick="${this.onAddNewRecord}"
      .icon="${PlusIcon()}"
      .text="${IS_MOBILE
        ? html`<span style="font-weight: 500">New</span>`
        : html`<span style="font-weight: 500">New Record</span>`}"
    >
    </data-view-component-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-view-header-tools-add-row': DataViewHeaderToolsAddRow;
  }
}
