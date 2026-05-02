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
import { DefaultTool, EdgelessCRUDIdentifier, TextUtils, } from '@linvo-core/block-surface';
import { bindSurfaceText, createSurfaceText, getLineHeight, PlainTextEditor, } from '@linvo-primitives/text';
import { MindmapElementModel, ShapeElementModel, TextResizing, } from '@linvo-core/content';
import { ThemeProvider } from '@linvo-core/shared/services';
import { getSelectedRect } from '@linvo-core/shared/utils';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { Bound, toRadian, Vec } from '@linvo-core/global/gfx';
import { WithDisposable } from '@linvo-core/global/lit';
import { ShadowlessElement, stdContext, } from '@linvo-core/std';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
import { RANGE_SYNC_EXCLUDE_ATTR } from '@linvo-core/std/inline';
import { consume } from '@lit/context';
import { html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
export function mountShapeTextEditor(shapeElement, edgeless) {
    const mountElm = edgeless.querySelector('.edgeless-mount-point');
    if (!mountElm) {
        throw new LinvoError(ErrorCode.ValueNotExists, "edgeless block's mount point does not exist");
    }
    const gfx = edgeless.std.get(GfxControllerIdentifier);
    const crud = edgeless.std.get(EdgelessCRUDIdentifier);
    const updatedElement = crud.getElementById(shapeElement.id);
    if (!(updatedElement instanceof ShapeElementModel)) {
        console.error('Cannot mount text editor on a non-shape element');
        return;
    }
    gfx.tool.setTool(DefaultTool);
    gfx.selection.set({
        elements: [shapeElement.id],
        editing: true,
    });
    if (!shapeElement.text) {
        edgeless.std
            .get(EdgelessCRUDIdentifier)
            .updateElement(shapeElement.id, { text: createSurfaceText() });
    }
    const shapeEditor = new EdgelessShapeTextEditor();
    shapeEditor.element = updatedElement;
    mountElm.append(shapeEditor);
}
let EdgelessShapeTextEditor = (() => {
    let _classSuper = WithDisposable(ShadowlessElement);
    let _element_decorators;
    let _element_initializers = [];
    let _element_extraInitializers = [];
    let _std_decorators;
    let _std_initializers = [];
    let _std_extraInitializers = [];
    let _plainTextEditor_decorators;
    let _plainTextEditor_initializers = [];
    let _plainTextEditor_extraInitializers = [];
    return class EdgelessShapeTextEditor extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _element_decorators = [property({ attribute: false })];
            _std_decorators = [consume({
                    context: stdContext,
                })];
            _plainTextEditor_decorators = [query('plain-text-editor')];
            __esDecorate(this, null, _element_decorators, { kind: "accessor", name: "element", static: false, private: false, access: { has: obj => "element" in obj, get: obj => obj.element, set: (obj, value) => { obj.element = value; } }, metadata: _metadata }, _element_initializers, _element_extraInitializers);
            __esDecorate(this, null, _std_decorators, { kind: "accessor", name: "std", static: false, private: false, access: { has: obj => "std" in obj, get: obj => obj.std, set: (obj, value) => { obj.std = value; } }, metadata: _metadata }, _std_initializers, _std_extraInitializers);
            __esDecorate(this, null, _plainTextEditor_decorators, { kind: "accessor", name: "plainTextEditor", static: false, private: false, access: { has: obj => "plainTextEditor" in obj, get: obj => obj.plainTextEditor, set: (obj, value) => { obj.plainTextEditor = value; } }, metadata: _metadata }, _plainTextEditor_initializers, _plainTextEditor_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        get inlineEditor() {
            return this.plainTextEditor;
        }
        get crud() {
            return this.std.get(EdgelessCRUDIdentifier);
        }
        get gfx() {
            return this.std.get(GfxControllerIdentifier);
        }
        get selection() {
            return this.gfx.selection;
        }
        get inlineEditorContainer() {
            return this.plainTextEditor?.rootElement;
        }
        get isMindMapNode() {
            return this.element.group instanceof MindmapElementModel;
        }
        _initMindmapKeyBindings() {
            if (!this.isMindMapNode) {
                return;
            }
            const selection = this.selection;
            this._disposables.addFromEvent(this, 'keydown', evt => {
                switch (evt.key) {
                    case 'Enter': {
                        evt.stopPropagation();
                        if (evt.shiftKey || evt.isComposing)
                            return;
                        this.ownerDocument.activeElement.blur();
                        selection.set({
                            elements: [this.element.id],
                            editing: false,
                        });
                        break;
                    }
                    case 'Esc':
                    case 'Tab': {
                        evt.stopPropagation();
                        this.ownerDocument.activeElement.blur();
                        selection.set({
                            elements: [this.element.id],
                            editing: false,
                        });
                        break;
                    }
                }
            });
        }
        _stashMindMapTree() {
            if (!this.isMindMapNode) {
                return;
            }
            const mindmap = this.element.group;
            const pop = mindmap.stashTree(mindmap.tree);
            this._disposables.add(() => {
                mindmap.layout();
                pop?.();
            });
        }
        _unmount() {
            this._resizeObserver?.disconnect();
            this._resizeObserver = null;
            if (this.element.text) {
                const text = this.element.text.toString();
                const trimed = text.trim();
                const len = trimed.length;
                if (len === 0) {
                    this.element.text = undefined;
                }
                else if (len < text.length) {
                    bindSurfaceText(this.element.text)?.set(trimed);
                }
            }
            this.element.textDisplay = true;
            this.remove();
            this.selection.set({
                elements: [],
                editing: false,
            });
        }
        _updateElementWH() {
            const bcr = this.plainTextEditor.getBoundingClientRect();
            const containerHeight = this.plainTextEditor.offsetHeight;
            const containerWidth = this.plainTextEditor.offsetWidth;
            const textResizing = this.element.textResizing;
            if ((containerHeight !== this.element.h &&
                textResizing === TextResizing.AUTO_HEIGHT) ||
                (textResizing === TextResizing.AUTO_WIDTH_AND_HEIGHT &&
                    (containerWidth !== this.element.w ||
                        containerHeight !== this.element.h))) {
                const [leftTopX, leftTopY] = Vec.rotWith([this.plainTextEditor.offsetLeft, this.plainTextEditor.offsetTop], [bcr.left + bcr.width / 2, bcr.top + bcr.height / 2], toRadian(-this.element.rotate));
                const [modelLeftTopX, modelLeftTopY] = this.gfx.viewport.toModelCoord(leftTopX, leftTopY);
                this.crud.updateElement(this.element.id, {
                    xywh: new Bound(modelLeftTopX, modelLeftTopY, textResizing === TextResizing.AUTO_WIDTH_AND_HEIGHT
                        ? containerWidth
                        : this.element.w, containerHeight).serialize(),
                });
                if (this._lastXYWH !== this.element.xywh) {
                    this.requestUpdate();
                }
                if (this.isMindMapNode) {
                    const mindmap = this.element.group;
                    mindmap.layout();
                }
                this.plainTextEditor.style.minHeight = `${containerHeight}px`;
            }
            this.selection.set({
                elements: [this.element.id],
                editing: true,
            });
        }
        connectedCallback() {
            super.connectedCallback();
            this.setAttribute(RANGE_SYNC_EXCLUDE_ATTR, 'true');
        }
        firstUpdated() {
            const dispatcher = this.std.event;
            this.element.textDisplay = false;
            this.disposables.add(this.gfx.viewport.viewportUpdated.subscribe(() => {
                this.requestUpdate();
                this.updateComplete
                    .then(() => {
                    this._updateElementWH();
                })
                    .catch(console.error);
            }));
            this.disposables.add(dispatcher.add('click', () => {
                return true;
            }));
            this.disposables.add(dispatcher.add('doubleClick', () => {
                return true;
            }));
            this.updateComplete
                .then(() => {
                if (!this.inlineEditor)
                    return;
                if (this.element.group instanceof MindmapElementModel) {
                    this.inlineEditor.selectAll();
                }
                else {
                    this.inlineEditor.focusEnd();
                }
                this.disposables.add(this.inlineEditor.slots.renderComplete.subscribe(() => {
                    this._updateElementWH();
                }));
                if (!this.inlineEditorContainer)
                    return;
                this.disposables.addFromEvent(this.inlineEditorContainer, 'blur', () => {
                    if (this._keeping)
                        return;
                    this._unmount();
                });
            })
                .catch(console.error);
            this.disposables.addFromEvent(this, 'keydown', evt => {
                if (evt.key === 'Escape') {
                    requestAnimationFrame(() => {
                        this.selection.set({
                            elements: [this.element.id],
                            editing: false,
                        });
                    });
                    this.ownerDocument.activeElement.blur();
                }
            });
            this._initMindmapKeyBindings();
            this._stashMindMapTree();
        }
        async getUpdateComplete() {
            const result = await super.getUpdateComplete();
            await this.plainTextEditor?.updateComplete;
            return result;
        }
        render() {
            if (!this.element.text) {
                console.error('Failed to mount shape editor because of no text.');
                return nothing;
            }
            const [verticalPadding, horiPadding] = this.element.padding;
            const textResizing = this.element.textResizing;
            const viewport = this.gfx.viewport;
            const zoom = viewport.zoom;
            const rect = getSelectedRect([this.element]);
            const rotate = this.element.rotate;
            const [leftTopX, leftTopY] = Vec.rotWith([rect.left, rect.top], [rect.left + rect.width / 2, rect.top + rect.height / 2], toRadian(rotate));
            const [x, y] = this.gfx.viewport.toViewCoord(leftTopX, leftTopY);
            const autoWidth = textResizing === TextResizing.AUTO_WIDTH_AND_HEIGHT;
            const color = this.std
                .get(ThemeProvider)
                .generateColorProperty(this.element.color, '#000000');
            const textController = bindSurfaceText(this.element.text);
            const lineHeight = getLineHeight(this.element.fontFamily, this.element.fontSize, this.element.fontWeight);
            const inlineEditorStyle = styleMap({
                position: 'absolute',
                left: x + 'px',
                top: y + 'px',
                width: textResizing === TextResizing.AUTO_HEIGHT
                    ? rect.width + 'px'
                    : 'fit-content',
                height: 'initial',
                minHeight: textResizing === TextResizing.AUTO_WIDTH_AND_HEIGHT
                    ? '1em'
                    : `${rect.height}px`,
                maxWidth: textResizing === TextResizing.AUTO_WIDTH_AND_HEIGHT
                    ? this.element.maxWidth
                        ? `${this.element.maxWidth}px`
                        : undefined
                    : undefined,
                boxSizing: 'border-box',
                fontSize: this.element.fontSize + 'px',
                fontFamily: TextUtils.wrapFontFamily(this.element.fontFamily),
                fontWeight: this.element.fontWeight,
                lineHeight: `${lineHeight}px`,
                outline: 'none',
                transform: `scale(${zoom}, ${zoom}) rotate(${rotate}deg)`,
                transformOrigin: 'top left',
                color,
                padding: `${verticalPadding}px ${horiPadding}px`,
                textAlign: this.element.textAlign,
                display: 'grid',
                gridTemplateColumns: '100%',
                alignItems: this.element.textVerticalAlign === 'center'
                    ? 'center'
                    : this.element.textVerticalAlign === 'bottom'
                        ? 'end'
                        : 'start',
                alignContent: 'center',
                gap: '0',
                zIndex: '1',
            });
            this._lastXYWH = this.element.xywh;
            return html ` <style>
        edgeless-shape-text-editor plain-text-editor v-text [data-v-text] {
          overflow-wrap: ${autoWidth ? 'normal' : 'anywhere'};
          word-break: ${autoWidth ? 'normal' : 'break-word'} !important;
          white-space: ${autoWidth ? 'pre' : 'pre-wrap'} !important;
        }

        edgeless-shape-text-editor .inline-editor {
          min-width: 1px;
        }
      </style>
      <plain-text-editor
        .text=${textController}
        .wrapMode=${autoWidth ? 'nowrap' : 'wrap'}
        style=${inlineEditorStyle}
      ></plain-text-editor>`;
        }
        setKeeping(keeping) {
            this._keeping = keeping;
        }
        #element_accessor_storage;
        get element() { return this.#element_accessor_storage; }
        set element(value) { this.#element_accessor_storage = value; }
        #std_accessor_storage;
        get std() { return this.#std_accessor_storage; }
        set std(value) { this.#std_accessor_storage = value; }
        #plainTextEditor_accessor_storage;
        get plainTextEditor() { return this.#plainTextEditor_accessor_storage; }
        set plainTextEditor(value) { this.#plainTextEditor_accessor_storage = value; }
        constructor() {
            super(...arguments);
            this._keeping = false;
            this._lastXYWH = '';
            this._resizeObserver = null;
            this.#element_accessor_storage = __runInitializers(this, _element_initializers, void 0);
            this.#std_accessor_storage = (__runInitializers(this, _element_extraInitializers), __runInitializers(this, _std_initializers, void 0));
            this.#plainTextEditor_accessor_storage = (__runInitializers(this, _std_extraInitializers), __runInitializers(this, _plainTextEditor_initializers, void 0));
            __runInitializers(this, _plainTextEditor_extraInitializers);
        }
    };
})();
export { EdgelessShapeTextEditor };
