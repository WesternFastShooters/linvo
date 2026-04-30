import { SignalWatcher } from '@linvo/global/lit';
import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  type AdapterItem,
  type AdapterPanelContext,
  adapterPanelContext,
  ADAPTERS,
} from '../config';

export const LINVO_ADAPTER_MENU = 'linvo-adapter-menu';

export class AdapterMenu extends SignalWatcher(LitElement) {
  static override styles = css`
    .adapter-menu {
      min-width: 120px;
      padding: 4px;
      background: var(--linvo-background-primary-color);
      border: 1px solid var(--linvo-border-color);
      border-radius: 4px;
      box-shadow: var(--linvo-shadow-1);
    }
    .adapter-menu-item {
      display: block;
      width: 100%;
      padding: 6px 8px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      color: var(--linvo-text-primary-color);
      font-family: var(--linvo-font-family);
      font-size: var(--linvo-font-xs);
      border-radius: 4px;
    }
    .adapter-menu-item:hover {
      background: var(--linvo-hover-color);
    }
    .adapter-menu-item.active {
      color: var(--linvo-primary-color);
      background: var(--linvo-hover-color);
    }
  `;

  get activeAdapter() {
    return this._context.activeAdapter$.value;
  }

  private readonly _handleAdapterChange = async (adapter: AdapterItem) => {
    this._context.activeAdapter$.value = adapter;
    this.abortController?.abort();
  };

  override render() {
    return html`<div class="adapter-menu">
      ${ADAPTERS.map(adapter => {
        const classes = classMap({
          'adapter-menu-item': true,
          active: this.activeAdapter.id === adapter.id,
        });
        return html`
          <button
            class=${classes}
            @click=${() => this._handleAdapterChange(adapter)}
          >
            ${adapter.label}
          </button>
        `;
      })}
    </div>`;
  }

  @property({ attribute: false })
  accessor abortController: AbortController | null = null;

  @consume({ context: adapterPanelContext })
  private accessor _context!: AdapterPanelContext;
}
declare global {
  interface HTMLElementTagNameMap {
    [LINVO_ADAPTER_MENU]: AdapterMenu;
  }
}
