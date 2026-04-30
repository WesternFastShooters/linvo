import { SignalWatcher } from '@linvo/global/lit';
import { css, html, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';

import type { MermaidInsertController } from './controller';

export class MermaidInsertModal extends SignalWatcher(LitElement) {
  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: var(--linvo-z-index-modal, 1000);
      pointer-events: none;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      pointer-events: auto;
    }

    .dialog {
      width: min(1480px, calc(100vw - 36px));
      min-height: min(900px, calc(100vh - 36px));
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .tabs {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 28px 44px 0;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .tab {
      padding: 0 4px 14px;
      border-bottom: 3px solid transparent;
      font-size: 15px;
      font-weight: 700;
      color: #232329;
    }

    .tab.active {
      color: #2f2b8f;
      border-bottom-color: #6c63ff;
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 28px 44px 0;
      gap: 24px;
    }

    .title {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .title strong {
      font-size: 20px;
      line-height: 1.2;
      color: #232329;
    }

    .title span {
      color: #3d3d45;
      font-size: 15px;
      font-style: italic;
      font-weight: 500;
    }

    .close {
      border: 0;
      background: transparent;
      font-size: 18px;
      cursor: pointer;
      color: #232329;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: grid;
      place-items: center;
    }

    .close:hover {
      background: rgba(108, 99, 255, 0.08);
    }

    .body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      min-height: 0;
      gap: 32px;
      padding: 20px 44px 0;
      flex: 1;
    }

    .pane {
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .label {
      padding: 0 0 10px;
      font-size: 14px;
      font-weight: 600;
      color: #232329;
    }

    textarea {
      flex: 1;
      min-height: 420px;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 14px;
      padding: 16px;
      resize: none;
      font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
      background: #fff;
      color: #232329;
      box-sizing: border-box;
    }

    .preview {
      flex: 1;
      border-radius: 14px;
      background: #fff;
      border: 1px solid rgba(15, 23, 42, 0.12);
      overflow: auto;
      padding: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 420px;
      box-sizing: border-box;
    }

    .preview svg {
      max-width: 100%;
      height: auto;
    }

    .preview.native {
      align-items: stretch;
    }

    .preview.native svg {
      width: 100%;
      height: 100%;
    }

    .status {
      color: rgba(35, 35, 41, 0.7);
      text-align: center;
      font-size: 14px;
      line-height: 1.6;
    }

    .status.error {
      color: #d14343;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 14px;
      padding: 20px 44px 28px;
    }

    button.action {
      min-width: 120px;
      height: 48px;
      border-radius: 999px;
      border: 0;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }

    button.secondary {
      background: transparent;
      color: #232329;
    }

    button.primary {
      background: #6c63ff;
      color: white;
    }

    button.primary:disabled {
      background: #c6c3ff;
      cursor: not-allowed;
    }

    .shortcut {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(35, 35, 41, 0.64);
      font-size: 12px;
      font-weight: 600;
    }

    .shortcut-key {
      border: 1px solid rgba(15, 23, 42, 0.16);
      border-radius: 8px;
      padding: 3px 8px;
      background: #fff;
      min-width: 24px;
      text-align: center;
    }

    @media (max-width: 1100px) {
      .dialog {
        width: min(100vw - 24px, 980px);
        min-height: unset;
        max-height: calc(100vh - 24px);
      }

      .body {
        grid-template-columns: 1fr;
      }

      textarea,
      .preview {
        min-height: 320px;
      }
    }
  `;

  @property({ attribute: false })
  accessor controller!: MermaidInsertController;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('keydown', this.onWindowKeyDown, true);
  }

  override disconnectedCallback(): void {
    window.removeEventListener('keydown', this.onWindowKeyDown, true);
    super.disconnectedCallback();
  }

  override render() {
    const snapshot = this.controller?.snapshot();
    if (!snapshot?.open) {
      return null;
    }

    return html`
      <div class="backdrop" @click=${this.onBackdropClick}>
        <div class="dialog" @click=${(event: Event) => event.stopPropagation()}>
          <div class="tabs">
            <div class="tab active">Mermaid</div>
          </div>
          <div class="header">
            <div class="title">
              <strong>Insert Mermaid</strong>
              <span>
                Flowcharts that map to canvas shapes render as hand-drawn preview.
                Unsupported diagram types fall back to SVG image preview.
              </span>
            </div>
            <button class="close" @click=${() => this.controller.close()}>
              ×
            </button>
          </div>
          <div class="body">
            <div class="pane">
              <div class="label">Mermaid syntax</div>
              <textarea
                .value=${snapshot.code}
                @input=${this.onInput}
                @keydown=${this.onKeyDown}
              ></textarea>
            </div>
            <div class="pane">
              <div class="label">Preview</div>
              <div class="preview ${snapshot.preview?.mode === 'native' ? 'native' : ''}">
                ${snapshot.rendering
                  ? html`<div class="status">Rendering Mermaid preview…</div>`
                  : snapshot.error
                    ? html`<div class="status error">${snapshot.error}</div>`
                    : snapshot.preview
                      ? html`${unsafeHTML(snapshot.preview.svg)}`
                      : html`<div class="status">No preview available.</div>`}
              </div>
            </div>
          </div>
          <div class="footer">
            <button
              class="action secondary"
              @click=${() => this.controller.close()}
            >
              Cancel
            </button>
            <button
              class="action primary"
              ?disabled=${!this.controller.canInsert.value}
              @click=${() => this.controller.startPlacement()}
            >
              Insert
            </button>
            <div class="shortcut">
              <span class="shortcut-key">Cmd</span>
              <span class="shortcut-key">Enter</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private onBackdropClick() {
    this.controller.close();
  }

  private onInput(event: Event) {
    const target = event.currentTarget as HTMLTextAreaElement;
    this.controller.updateCode(target.value);
  }

  private onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      this.controller.startPlacement();
    }
  }

  private onWindowKeyDown = (event: KeyboardEvent) => {
    if (!this.controller?.snapshot().open || event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.controller.close();
  };
}
