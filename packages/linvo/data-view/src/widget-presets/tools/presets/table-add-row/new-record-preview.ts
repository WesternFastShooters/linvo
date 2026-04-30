import { PlusIcon } from '@icons/lit';
import { ShadowlessElement } from '@linvo/std';
import { cssVarV2 } from '@theme/v2';
import { html, unsafeCSS } from 'lit';

export class NewRecordPreview extends ShadowlessElement {
  override render() {
    return html`
      <style>
        linvo-database-new-record-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          height: 32px;
          width: 32px;
          border: 1px solid ${unsafeCSS(cssVarV2.layer.insideBorder.border)};
          border-radius: 50%;
          background: var(--linvo-blue-100);
          box-shadow:
            0px 0px 10px rgba(0, 0, 0, 0.05),
            0px 0px 0px 0.5px var(--linvo-black-10);
          cursor: none;
          user-select: none;
          pointer-events: none;
          caret-color: transparent;
          z-index: 99999;
        }

        linvo-database-new-record-preview svg {
          width: 16px;
          height: 16px;
        }

        linvo-database-new-record-preview path {
          fill: var(--linvo-brand-color);
        }
      </style>
      ${PlusIcon()}
    `;
  }
}
