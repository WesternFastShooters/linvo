var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { SignalWatcher } from '@linvo-core/global/lit';
import { css, html, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';
let MermaidInsertModal = (() => {
    let _classSuper = SignalWatcher(LitElement);
    let _controller_decorators;
    let _controller_initializers = [];
    let _controller_extraInitializers = [];
    return class MermaidInsertModal extends _classSuper {
        constructor() {
            super(...arguments);
            this.#controller_accessor_storage = __runInitializers(this, _controller_initializers, void 0);
            this.onWindowKeyDown = (__runInitializers(this, _controller_extraInitializers), (event) => {
                if (!this.controller?.snapshot().open || event.key !== 'Escape') {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                this.controller.close();
            });
        }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _controller_decorators = [property({ attribute: false })];
            __esDecorate(this, null, _controller_decorators, { kind: "accessor", name: "controller", static: false, private: false, access: { has: obj => "controller" in obj, get: obj => obj.controller, set: (obj, value) => { obj.controller = value; } }, metadata: _metadata }, _controller_initializers, _controller_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static { this.styles = css `
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
  `; }
        #controller_accessor_storage;
        get controller() { return this.#controller_accessor_storage; }
        set controller(value) { this.#controller_accessor_storage = value; }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener('keydown', this.onWindowKeyDown, true);
        }
        disconnectedCallback() {
            window.removeEventListener('keydown', this.onWindowKeyDown, true);
            super.disconnectedCallback();
        }
        render() {
            const snapshot = this.controller?.snapshot();
            if (!snapshot?.open) {
                return null;
            }
            return html `
      <div class="backdrop" @click=${this.onBackdropClick}>
        <div class="dialog" @click=${(event) => event.stopPropagation()}>
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
                ? html `<div class="status">Rendering Mermaid preview…</div>`
                : snapshot.error
                    ? html `<div class="status error">${snapshot.error}</div>`
                    : snapshot.preview
                        ? html `${unsafeHTML(snapshot.preview.svg)}`
                        : html `<div class="status">No preview available.</div>`}
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
        onBackdropClick() {
            this.controller.close();
        }
        onInput(event) {
            const target = event.currentTarget;
            this.controller.updateCode(target.value);
        }
        onKeyDown(event) {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault();
                this.controller.startPlacement();
            }
        }
    };
})();
export { MermaidInsertModal };
