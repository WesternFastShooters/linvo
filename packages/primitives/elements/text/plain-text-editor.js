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
import { defineCustomElement } from '@linvo-core/global/utils';
import { InlineEditor } from '@linvo-core/std/inline';
import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Subject } from 'rxjs';
class PlainTextInlineModel {
    constructor(_text) {
        this._text = _text;
        this.attached = true;
        this._listeners = new Set();
        this._disposeSourceObserver = _text.observe(event => {
            const nextEvent = {
                isLocal: event.local,
            };
            this._listeners.forEach(listener => {
                listener(nextEvent);
            });
        });
    }
    get length() {
        return this._text.length ?? this._text.toString().length;
    }
    createCursor(index) {
        return index;
    }
    delete(index, length) {
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
    format() { }
    insert(content, index, _attributes) {
        if (!content.length) {
            return;
        }
        const current = this.toString();
        this._assertRange(index, 0, current.length);
        this._text.set(current.slice(0, index) + content + current.slice(index));
    }
    observe(listener) {
        this._listeners.add(listener);
    }
    resolveCursor(cursor) {
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
    transact(fn) {
        fn();
    }
    unobserve(listener) {
        this._listeners.delete(listener);
    }
    _assertRange(index, length, textLength) {
        if (index < 0 || length < 0 || index + length > textLength) {
            throw new RangeError(`PlainText range out of bounds: index=${index}, length=${length}, textLength=${textLength}`);
        }
    }
}
let PlainTextEditor = (() => {
    let _classSuper = LitElement;
    let __inlineEditorContainer_decorators;
    let __inlineEditorContainer_initializers = [];
    let __inlineEditorContainer_extraInitializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let _readonly_decorators;
    let _readonly_initializers = [];
    let _readonly_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    let _wrapMode_decorators;
    let _wrapMode_initializers = [];
    let _wrapMode_extraInitializers = [];
    return class PlainTextEditor extends _classSuper {
        constructor() {
            super(...arguments);
            this._model = null;
            this._inlineEditor = null;
            this._onCopy = (event) => {
                const inlineEditor = this.inlineEditor;
                if (!inlineEditor) {
                    return;
                }
                const inlineRange = inlineEditor.getInlineRange();
                if (!inlineRange) {
                    return;
                }
                const text = inlineEditor.yTextString.slice(inlineRange.index, inlineRange.index + inlineRange.length);
                event.clipboardData?.setData('text/plain', text);
                event.preventDefault();
                event.stopPropagation();
            };
            this._onCut = (event) => {
                const inlineEditor = this.inlineEditor;
                if (!inlineEditor) {
                    return;
                }
                const inlineRange = inlineEditor.getInlineRange();
                if (!inlineRange) {
                    return;
                }
                const text = inlineEditor.yTextString.slice(inlineRange.index, inlineRange.index + inlineRange.length);
                inlineEditor.deleteText(inlineRange);
                inlineEditor.setInlineRange({
                    index: inlineRange.index,
                    length: 0,
                });
                event.clipboardData?.setData('text/plain', text);
                event.preventDefault();
                event.stopPropagation();
            };
            this._onPaste = (event) => {
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
            this.#_inlineEditorContainer_accessor_storage = __runInitializers(this, __inlineEditorContainer_initializers, void 0);
            this.#placeholder_accessor_storage = (__runInitializers(this, __inlineEditorContainer_extraInitializers), __runInitializers(this, _placeholder_initializers, ''));
            this.#readonly_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _readonly_initializers, false));
            this.#text_accessor_storage = (__runInitializers(this, _readonly_extraInitializers), __runInitializers(this, _text_initializers, null));
            this.#wrapMode_accessor_storage = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _wrapMode_initializers, 'wrap'));
            this.slots = (__runInitializers(this, _wrapMode_extraInitializers), {
                renderComplete: new Subject(),
            });
        }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __inlineEditorContainer_decorators = [query('.inline-editor')];
            _placeholder_decorators = [property({ attribute: false })];
            _readonly_decorators = [property({ attribute: false })];
            _text_decorators = [property({ attribute: false })];
            _wrapMode_decorators = [property({ attribute: false })];
            __esDecorate(this, null, __inlineEditorContainer_decorators, { kind: "accessor", name: "_inlineEditorContainer", static: false, private: false, access: { has: obj => "_inlineEditorContainer" in obj, get: obj => obj._inlineEditorContainer, set: (obj, value) => { obj._inlineEditorContainer = value; } }, metadata: _metadata }, __inlineEditorContainer_initializers, __inlineEditorContainer_extraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, _readonly_decorators, { kind: "accessor", name: "readonly", static: false, private: false, access: { has: obj => "readonly" in obj, get: obj => obj.readonly, set: (obj, value) => { obj.readonly = value; } }, metadata: _metadata }, _readonly_initializers, _readonly_extraInitializers);
            __esDecorate(this, null, _text_decorators, { kind: "accessor", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(this, null, _wrapMode_decorators, { kind: "accessor", name: "wrapMode", static: false, private: false, access: { has: obj => "wrapMode" in obj, get: obj => obj.wrapMode, set: (obj, value) => { obj.wrapMode = value; } }, metadata: _metadata }, _wrapMode_initializers, _wrapMode_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static { this.styles = css `
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
  `; }
        get inlineEditor() {
            return this._inlineEditor;
        }
        get length() {
            return this.text?.length ?? this.text?.toString().length ?? 0;
        }
        get rootElement() {
            return this._inlineEditorContainer;
        }
        #_inlineEditorContainer_accessor_storage;
        get _inlineEditorContainer() { return this.#_inlineEditorContainer_accessor_storage; }
        set _inlineEditorContainer(value) { this.#_inlineEditorContainer_accessor_storage = value; }
        #placeholder_accessor_storage;
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #readonly_accessor_storage;
        get readonly() { return this.#readonly_accessor_storage; }
        set readonly(value) { this.#readonly_accessor_storage = value; }
        #text_accessor_storage;
        get text() { return this.#text_accessor_storage; }
        set text(value) { this.#text_accessor_storage = value; }
        #wrapMode_accessor_storage;
        get wrapMode() { return this.#wrapMode_accessor_storage; }
        set wrapMode(value) { this.#wrapMode_accessor_storage = value; }
        createRenderRoot() {
            return this;
        }
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener('copy', this._onCopy);
            this.addEventListener('cut', this._onCut);
            this.addEventListener('paste', this._onPaste);
        }
        disconnectedCallback() {
            this.removeEventListener('copy', this._onCopy);
            this.removeEventListener('cut', this._onCut);
            this.removeEventListener('paste', this._onPaste);
            this._destroyEditor();
            super.disconnectedCallback();
        }
        focusEnd() {
            this.inlineEditor?.focusEnd();
        }
        focusIndex(index) {
            this.inlineEditor?.focusIndex(index);
        }
        async getUpdateComplete() {
            const result = await super.getUpdateComplete();
            await this.inlineEditor?.waitForUpdate();
            return result;
        }
        selectAll() {
            this.inlineEditor?.selectAll();
        }
        _createEditor() {
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
        _destroyEditor() {
            this._inlineEditor?.unmount();
            this._inlineEditor = null;
            this._model?.destroy();
            this._model = null;
        }
        _resetEditor() {
            this._destroyEditor();
            this._createEditor();
        }
        render() {
            const classes = classMap({
                'inline-editor': true,
                'nowrap-lines': this.wrapMode === 'nowrap',
                readonly: this.readonly,
            });
            return html `<div
      contenteditable=${this.readonly ? 'false' : 'true'}
      class=${classes}
      data-placeholder=${this.placeholder}
    ></div>`;
        }
        updated(changedProperties) {
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
    };
})();
export { PlainTextEditor };
defineCustomElement('plain-text-editor', PlainTextEditor);
