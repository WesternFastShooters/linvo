import { unsafeCSSVarV2 } from '@linvo/linvo-shared/theme';
import { EmbedIcon, OpenInNewIcon } from '@icons/lit';
import { baseTheme } from '@theme';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

export class EmbedIframeSuspendedCard extends LitElement {
  static override styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    .linvo-embed-iframe-suspended-card {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      padding: 14px;
      border-radius: 8px;
      border: 1px solid ${unsafeCSSVarV2('layer/insideBorder/border')};
      background:
        linear-gradient(
          180deg,
          ${unsafeCSSVarV2('layer/background/secondary')},
          ${unsafeCSSVarV2('layer/background/hoverOverlay')}
        );
      overflow: hidden;
      user-select: none;
      font-family: ${unsafeCSS(baseTheme.fontSansFamily)};
    }

    .header,
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      color: ${unsafeCSSVarV2('text/secondary')};
      font-size: var(--linvo-font-xs);
      line-height: 20px;
      font-weight: 500;
    }

    .title {
      color: ${unsafeCSSVarV2('text/primary')};
      font-size: var(--linvo-font-sm);
      line-height: 22px;
      font-weight: 600;
      word-break: break-word;
    }

    .description {
      color: ${unsafeCSSVarV2('text/secondary')};
      font-size: var(--linvo-font-xs);
      line-height: 20px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .link {
      flex: 1;
      min-width: 0;
      color: ${unsafeCSSVarV2('text/emphasis')};
      font-size: var(--linvo-font-xs);
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .hint {
      flex-shrink: 0;
      color: ${unsafeCSSVarV2('text/secondary')};
      font-size: var(--linvo-font-xs);
      line-height: 20px;
      white-space: nowrap;
    }
  `;

  override render() {
    return html`
      <div class="linvo-embed-iframe-suspended-card">
        <div class="header">
          <div class="badge">
            ${EmbedIcon()}
            <span>Web Preview</span>
          </div>
          <span class="hint">${this.reason}</span>
        </div>
        <div class="body">
          <div class="title">${this.title || 'Preview ready'}</div>
          ${this.description
            ? html`<div class="description">${this.description}</div>`
            : nothing}
        </div>
        <div class="footer">
          <div class="link">${this.url}</div>
          <div class="badge">
            ${OpenInNewIcon()}
            <span>Open</span>
          </div>
        </div>
      </div>
    `;
  }

  @property()
  accessor description = '';

  @property()
  accessor reason = 'Paused';

  @property()
  accessor title = '';

  @property()
  accessor url = '';
}
