import { SignalWatcher, WithDisposable } from '@linvo-core/global/lit';
import type { DocMode } from '@linvo-core/content';
import { ThemeProvider } from '@linvo-core/shared/services';
import { BlockStdScope, ShadowlessElement } from '@linvo-core/std';
import {
  type BlockModel,
  type ExtensionType,
  type Store,
} from '@linvo-core/store';
import { computed, signal } from '@preact/signals-core';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { when } from 'lit/directives/when.js';

type AutofocusTextHost = HTMLElement & {
  focusEnd?: () => void;
  inlineEditor?: {
    focusEnd?: () => void;
  };
};

export class TestLinvoEditorContainer extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = css`
    .linvo-page-viewport {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      container-name: viewport;
      container-type: inline-size;
      font-family: var(--linvo-font-family);
    }
    .linvo-page-viewport * {
      box-sizing: border-box;
    }

    @media print {
      .linvo-page-viewport {
        height: auto;
      }
    }

    .playground-page-editor-container {
      flex-grow: 1;
      font-family: var(--linvo-font-family);
      display: block;
    }

    .playground-page-editor-container * {
      box-sizing: border-box;
    }

    @media print {
      .playground-page-editor-container {
        height: auto;
      }
    }

    .edgeless-editor-container {
      font-family: var(--linvo-font-family);
      background: var(--linvo-background-primary-color);
      display: block;
      height: 100%;
      position: relative;
      overflow: clip;
    }

    .edgeless-editor-container * {
      box-sizing: border-box;
    }

    @media print {
      .edgeless-editor-container {
        height: auto;
      }
    }

    .linvo-edgeless-viewport {
      display: block;
      height: 100%;
      position: relative;
      overflow: clip;
      container-name: viewport;
      container-type: inline-size;
    }
  `;

  private readonly _doc = signal<Store>();

  private readonly _edgelessSpecs = signal<ExtensionType[]>([]);

  private readonly _mode = signal<DocMode>('edgeless');

  private readonly _specs = computed(() => this._edgelessSpecs.value);

  private readonly _std = computed(() => {
    return new BlockStdScope({
      store: this.doc,
      extensions: this._specs.value,
    });
  });

  private readonly _editorTemplate = computed(() => {
    return this._std.value.render();
  });

  get doc() {
    return this._doc.value as Store;
  }

  set doc(doc: Store) {
    this._doc.value = doc;
  }

  set edgelessSpecs(specs: ExtensionType[]) {
    this._edgelessSpecs.value = specs;
  }

  get edgelessSpecs() {
    return this._edgelessSpecs.value;
  }

  get host() {
    try {
      return this.std.host;
    } catch {
      return null;
    }
  }

  get mode() {
    return this._mode.value;
  }

  set mode(mode: DocMode) {
    this._mode.value = mode;
  }

  set pageSpecs(specs: ExtensionType[]) {
    this._edgelessSpecs.value = specs;
  }

  get pageSpecs() {
    return this._edgelessSpecs.value;
  }

  get rootModel() {
    return this.doc.root as BlockModel;
  }

  get std() {
    return this._std.value;
  }

  override connectedCallback() {
    super.connectedCallback();

    this._disposables.add(
      this.doc.slots.rootAdded.subscribe(() => this.requestUpdate())
    );
  }

  override firstUpdated() {
    setTimeout(() => {
      if (this.autofocus) {
        const textHost = this.querySelector<AutofocusTextHost>(
          'plain-text-editor'
        );
        textHost?.inlineEditor?.focusEnd?.();
        textHost?.focusEnd?.();
      }
    });
  }

  override render() {
    const mode = this._mode.value;
    const themeService = this.std.get(ThemeProvider);
    const edgelessTheme = themeService.edgeless$.value;

    return html`${keyed(
      this.rootModel.id + mode,
      html`
        <div data-theme=${edgelessTheme} class="linvo-edgeless-viewport">
          <div class="edgeless-editor-container">
            ${this._editorTemplate.value}
          </div>
        </div>
      `
    )}`;
  }

  switchEditor(mode: DocMode) {
    this._mode.value = mode;
  }

  @property({ attribute: false })
  override accessor autofocus = false;
}

declare global {
  interface HTMLElementTagNameMap {
    'test-linvo-editor-container': TestLinvoEditorContainer;
  }
}
