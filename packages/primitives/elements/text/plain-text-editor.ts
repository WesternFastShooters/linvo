import { defineCustomElement } from '@linvo-core/global/utils';
import { InlineEditor } from '@linvo-core/std/inline';
import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Subject } from 'rxjs';

import type { EditableTextLike } from '@linvo-core/store/reactive/text';

type PlainTextChangeEvent = {
  isLocal: boolean;
};

class PlainTextInlineModel {
  readonly attached = true;

  private readonly _listeners = new Set<
    (event: PlainTextChangeEvent) => void
  >();

  private readonly _disposeSourceObserver: (() => void) | void;

  constructor(private readonly _text: EditableTextLike) {
    this._disposeSourceObserver = _text.observe(event => {
      const nextEvent = {
        isLocal: event.local,
      } satisfies PlainTextChangeEvent;

      this._listeners.forEach(listener => {
        listener(nextEvent);
      });
    });
  }

  get length() {
    return this._text.length ?? this._text.toString().length;
  }

  createCursor(index: number) {
    return index;
  }

  delete(index: number, length: number) {
    if (length <= 0) {
      return;
    }

    const current = this.toString();
    this._assertRange(index, length, current.length);
    this._text.set(current.slice(0, index) + current.slice(index + length));
  }

  destroy() {
    if (typeof this._disposeSourceObserver === 'function') {
      this._disposeSourceObserver();
    }
    this._listeners.clear();
  }

  format() {}

  insert(
    content: string,
    index: number,
    _attributes?: Record<string, unknown>
  ) {
    if (!content.length) {
      return;
    }

    const current = this.toString();
    this._assertRange(index, 0, current.length);
    this._text.set(current.slice(0, index) + content + current.slice(index));
  }

  observe(listener: (event: PlainTextChangeEvent) => void) {
    this._listeners.add(listener);
  }

  resolveCursor(cursor: unknown) {
    if (typeof cursor !== 'number' || Number.isNaN(cursor)) {
      return null;
    }

    return cursor >= 0 && cursor <= this.length ? cursor : null;
  }

  toDelta() {
    const text = this.toString();
    return text.length > 0 ? [{ insert: text }] : [];
  }

  toString() {
    return this._text.toString().replaceAll('\r\n', '\n');
  }

  transact(fn: () => void) {
    fn();
  }

  unobserve(listener: (event: PlainTextChangeEvent) => void) {
    this._listeners.delete(listener);
  }

  private _assertRange(index: number, length: number, textLength: number) {
    if (index < 0 || length < 0 || index + length > textLength) {
      throw new RangeError(
        `PlainText range out of bounds: index=${index}, length=${length}, textLength=${textLength}`
      );
    }
  }
}

export class PlainTextEditor extends LitElement {
  static override styles = css`
    plain-text-editor {
      display: block;
      height: 100%;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-margin-top: 50px;
      scroll-margin-bottom: 30px;
    }

    .inline-editor {
      height: 100%;
      width: 100%;
      outline: none;
      cursor: text;
    }

    .inline-editor.readonly {
      cursor: default;
    }

    plain-text-editor .nowrap-lines v-text span,
    plain-text-editor .nowrap-lines v-element span {
      white-space: pre !important;
    }
  `;

  private _model: PlainTextInlineModel | null = null;

  private _inlineEditor: InlineEditor | null = null;

  private readonly _onCopy = (event: ClipboardEvent) => {
    const inlineEditor = this.inlineEditor;
    if (!inlineEditor) {
      return;
    }

    const inlineRange = inlineEditor.getInlineRange();
    if (!inlineRange) {
      return;
    }

    const text = inlineEditor.yTextString.slice(
      inlineRange.index,
      inlineRange.index + inlineRange.length
    );

    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
    event.stopPropagation();
  };

  private readonly _onCut = (event: ClipboardEvent) => {
    const inlineEditor = this.inlineEditor;
    if (!inlineEditor) {
      return;
    }

    const inlineRange = inlineEditor.getInlineRange();
    if (!inlineRange) {
      return;
    }

    const text = inlineEditor.yTextString.slice(
      inlineRange.index,
      inlineRange.index + inlineRange.length
    );

    inlineEditor.deleteText(inlineRange);
    inlineEditor.setInlineRange({
      index: inlineRange.index,
      length: 0,
    });

    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
    event.stopPropagation();
  };

  private readonly _onPaste = (event: ClipboardEvent) => {
    const inlineEditor = this.inlineEditor;
    if (!inlineEditor) {
      return;
    }

    const inlineRange = inlineEditor.getInlineRange();
    if (!inlineRange) {
      return;
    }

    const text = event.clipboardData
      ?.getData('text/plain')
      ?.replace(/\r?\n|\r/g, '\n');

    if (!text) {
      return;
    }

    inlineEditor.insertText(inlineRange, text);
    inlineEditor.setInlineRange({
      index: inlineRange.index + text.length,
      length: 0,
    });

    event.preventDefault();
    event.stopPropagation();
  };

  get inlineEditor() {
    return this._inlineEditor;
  }

  get length() {
    return this.text?.length ?? this.text?.toString().length ?? 0;
  }

  get rootElement() {
    return this._inlineEditorContainer;
  }

  @query('.inline-editor')
  private accessor _inlineEditorContainer!: HTMLDivElement;

  @property({ attribute: false })
  accessor placeholder = '';

  @property({ attribute: false })
  accessor readonly = false;

  @property({ attribute: false })
  accessor text: EditableTextLike | null = null;

  @property({ attribute: false })
  accessor wrapMode: 'nowrap' | 'wrap' = 'wrap';

  readonly slots = {
    renderComplete: new Subject<void>(),
  };

  protected override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('copy', this._onCopy);
    this.addEventListener('cut', this._onCut);
    this.addEventListener('paste', this._onPaste);
  }

  override disconnectedCallback() {
    this.removeEventListener('copy', this._onCopy);
    this.removeEventListener('cut', this._onCut);
    this.removeEventListener('paste', this._onPaste);
    this._destroyEditor();
    super.disconnectedCallback();
  }

  focusEnd() {
    this.inlineEditor?.focusEnd();
  }

  focusIndex(index: number) {
    this.inlineEditor?.focusIndex(index);
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.inlineEditor?.waitForUpdate();
    return result;
  }

  selectAll() {
    this.inlineEditor?.selectAll();
  }

  private _createEditor() {
    if (!this.text) {
      return;
    }

    this._model = new PlainTextInlineModel(this.text);
    this._inlineEditor = new InlineEditor(this._model);
    this._inlineEditor.mount(this._inlineEditorContainer, undefined, this.readonly);
    this._inlineEditor.slots.renderComplete.subscribe(() => {
      this.slots.renderComplete.next();
    });
  }

  private _destroyEditor() {
    this._inlineEditor?.unmount();
    this._inlineEditor = null;
    this._model?.destroy();
    this._model = null;
  }

  private _resetEditor() {
    this._destroyEditor();
    this._createEditor();
  }

  override render() {
    const classes = classMap({
      'inline-editor': true,
      'nowrap-lines': this.wrapMode === 'nowrap',
      readonly: this.readonly,
    });

    return html`<div
      contenteditable=${this.readonly ? 'false' : 'true'}
      class=${classes}
      data-placeholder=${this.placeholder}
    ></div>`;
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('text')) {
      this._resetEditor();
      return;
    }

    if (changedProperties.has('readonly')) {
      this.inlineEditor?.setReadonly(this.readonly);
    }

    if (changedProperties.has('wrapMode')) {
      this.inlineEditor?.render();
    }
  }
}

defineCustomElement('plain-text-editor', PlainTextEditor);
