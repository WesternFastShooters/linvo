import { unsafeCSSVarV2 } from '@blocksuite/affine-shared/theme';
import { WithDisposable } from '@blocksuite/global/lit';
import { css, html, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export function normalizeWebPreviewUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export type WebPreviewSubmitPayload = {
  clientX: number;
  clientY: number;
  url: string;
};

export class EdgelessWebPreviewUrlModal extends WithDisposable(LitElement) {
  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
    }

    .web-preview-modal {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mask {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.24);
      backdrop-filter: blur(2px);
    }

    .panel {
      position: relative;
      width: min(560px, calc(100vw - 32px));
      border-radius: 20px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: ${unsafeCSSVarV2('layer/background/primary')};
      box-shadow:
        0 24px 64px rgba(15, 23, 42, 0.18),
        0 8px 24px rgba(15, 23, 42, 0.08);
      padding: 24px;
      box-sizing: border-box;
    }

    .title {
      font-size: 22px;
      line-height: 30px;
      font-weight: 600;
      color: ${unsafeCSSVarV2('text/primary')};
    }

    .description {
      margin-top: 8px;
      font-size: 14px;
      line-height: 22px;
      color: ${unsafeCSSVarV2('text/secondary')};
    }

    .input {
      width: 100%;
      margin-top: 20px;
      height: 52px;
      border-radius: 14px;
      border: 1px solid rgba(15, 23, 42, 0.1);
      background: rgba(248, 250, 252, 0.9);
      padding: 0 16px;
      box-sizing: border-box;
      font-size: 15px;
      line-height: 24px;
      outline: none;
    }

    .input:focus {
      border-color: #3b82f6;
      background: white;
    }

    .error {
      min-height: 20px;
      margin-top: 10px;
      font-size: 13px;
      line-height: 20px;
      color: #dc2626;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    .button {
      height: 40px;
      min-width: 88px;
      padding: 0 16px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      line-height: 20px;
      font-weight: 600;
    }

    .button.secondary {
      background: rgba(148, 163, 184, 0.14);
      color: ${unsafeCSSVarV2('text/primary')};
    }

    .button.primary {
      background: #2563eb;
      color: white;
    }

    .button.primary.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  private readonly _close = () => {
    this.abortController?.abort();
  };

  private readonly _submit = (event: MouseEvent) => {
    const normalized = normalizeWebPreviewUrl(this.value);
    if (!normalized) {
      this.error = '请输入有效的网址，缺少协议时会自动补全为 https://';
      return;
    }

    this.onSubmit?.({
      clientX: event.clientX || window.innerWidth / 2,
      clientY: event.clientY || window.innerHeight / 2,
      url: normalized,
    });
    this._close();
  };

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === 'Escape') {
      this._close();
      return;
    }

    if (event.key === 'Enter' && !event.isComposing) {
      this._submit(event as unknown as MouseEvent);
    }
  };

  override connectedCallback() {
    super.connectedCallback();

    this.updateComplete
      .then(() => {
        this.input.focus();
        this.input.select();
      })
      .catch(console.error);
  }

  override render() {
    const primaryClass = classMap({
      button: true,
      primary: true,
      disabled: !this.value.trim(),
    });

    return html`
      <div class="web-preview-modal" @keydown=${this._handleKeyDown}>
        <div class="mask" @click=${this._close}></div>
        <div class="panel">
          <div class="title">创建网页预览</div>
          <div class="description">
            输入网站地址。像 www.baidu.com 这样的地址会自动补全为
            https://www.baidu.com。
          </div>
          <input
            class="input"
            .value=${this.value}
            placeholder="输入网址，例如 www.baidu.com"
            @input=${(event: InputEvent) => {
              this.value = (event.target as HTMLInputElement).value;
              this.error = '';
            }}
          />
          <div class="error">${this.error}</div>
          <div class="actions">
            <button class="button secondary" @click=${this._close}>取消</button>
            <button class=${primaryClass} @click=${this._submit}>完成</button>
          </div>
        </div>
      </div>
    `;
  }

  @property({ attribute: false })
  accessor abortController: AbortController | null = null;

  @property({ attribute: false })
  accessor onSubmit: ((payload: WebPreviewSubmitPayload) => void) | null = null;

  @query('.input')
  accessor input!: HTMLInputElement;

  @state()
  accessor error = '';

  @state()
  accessor value = '';
}
