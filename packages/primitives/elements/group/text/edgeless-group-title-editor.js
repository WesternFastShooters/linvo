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
import { DefaultTool } from '@linvo-core/block-surface';
import { bindSurfaceText, PlainTextEditor, } from '@linvo-primitives/text';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { Bound } from '@linvo-core/global/gfx';
import { WithDisposable } from '@linvo-core/global/lit';
import { ShadowlessElement, stdContext, } from '@linvo-core/std';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
import { RANGE_SYNC_EXCLUDE_ATTR } from '@linvo-core/std/inline';
import { consume } from '@lit/context';
import { html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { GROUP_TITLE_FONT_SIZE, GROUP_TITLE_OFFSET, GROUP_TITLE_PADDING, } from '../element-renderer/consts';
export function mountGroupTitleEditor(group, edgeless) {
    const mountElm = edgeless.querySelector('.edgeless-mount-point');
    if (!mountElm) {
        throw new LinvoError(ErrorCode.ValueNotExists, "edgeless block's mount point does not exist");
    }
    const gfx = edgeless.std.get(GfxControllerIdentifier);
    gfx.tool.setTool(DefaultTool);
    gfx.selection.set({
        elements: [group.id],
        editing: true,
    });
    const groupEditor = new EdgelessGroupTitleEditor();
    groupEditor.group = group;
    mountElm.append(groupEditor);
}
let EdgelessGroupTitleEditor = (() => {
    let _classSuper = WithDisposable(ShadowlessElement);
    let _group_decorators;
    let _group_initializers = [];
    let _group_extraInitializers = [];
    let _std_decorators;
    let _std_initializers = [];
    let _std_extraInitializers = [];
    let _plainTextEditor_decorators;
    let _plainTextEditor_initializers = [];
    let _plainTextEditor_extraInitializers = [];
    return class EdgelessGroupTitleEditor extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _group_decorators = [property({ attribute: false })];
            _std_decorators = [consume({
                    context: stdContext,
                })];
            _plainTextEditor_decorators = [query('plain-text-editor')];
            __esDecorate(this, null, _group_decorators, { kind: "accessor", name: "group", static: false, private: false, access: { has: obj => "group" in obj, get: obj => obj.group, set: (obj, value) => { obj.group = value; } }, metadata: _metadata }, _group_initializers, _group_extraInitializers);
            __esDecorate(this, null, _std_decorators, { kind: "accessor", name: "std", static: false, private: false, access: { has: obj => "std" in obj, get: obj => obj.std, set: (obj, value) => { obj.std = value; } }, metadata: _metadata }, _std_initializers, _std_extraInitializers);
            __esDecorate(this, null, _plainTextEditor_decorators, { kind: "accessor", name: "plainTextEditor", static: false, private: false, access: { has: obj => "plainTextEditor" in obj, get: obj => obj.plainTextEditor, set: (obj, value) => { obj.plainTextEditor = value; } }, metadata: _metadata }, _plainTextEditor_initializers, _plainTextEditor_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        get inlineEditor() {
            return this.plainTextEditor;
        }
        get inlineEditorContainer() {
            return this.plainTextEditor?.rootElement;
        }
        get gfx() {
            return this.std.get(GfxControllerIdentifier);
        }
        get selection() {
            return this.gfx.selection;
        }
        _unmount() {
            // dispose in advance to avoid execute `this.remove()` twice
            this.disposables.dispose();
            this.group.showTitle = true;
            this.selection.set({
                elements: [this.group.id],
                editing: false,
            });
            this.remove();
        }
        connectedCallback() {
            super.connectedCallback();
            this.setAttribute(RANGE_SYNC_EXCLUDE_ATTR, 'true');
        }
        firstUpdated() {
            const dispatcher = this.std.event;
            this.updateComplete
                .then(() => {
                if (!this.inlineEditor)
                    return;
                this.inlineEditor.selectAll();
                this.group.showTitle = false;
                this.inlineEditor.slots.renderComplete.subscribe(() => {
                    this.requestUpdate();
                });
                this.disposables.add(dispatcher.add('keyDown', ctx => {
                    const state = ctx.get('keyboardState');
                    if (state.raw.key === 'Enter' && !state.raw.isComposing) {
                        this._unmount();
                        return true;
                    }
                    requestAnimationFrame(() => {
                        this.requestUpdate();
                    });
                    return false;
                }));
                this.disposables.add(this.gfx.viewport.viewportUpdated.subscribe(() => {
                    this.requestUpdate();
                }));
                this.disposables.add(dispatcher.add('click', () => true));
                this.disposables.add(dispatcher.add('doubleClick', () => true));
                if (!this.inlineEditorContainer)
                    return;
                this.disposables.addFromEvent(this.inlineEditorContainer, 'blur', () => {
                    this._unmount();
                });
            })
                .catch(console.error);
        }
        async getUpdateComplete() {
            const result = await super.getUpdateComplete();
            await this.plainTextEditor?.updateComplete;
            return result;
        }
        render() {
            if (!this.group.externalXYWH) {
                console.error('group.externalXYWH is not set');
                return nothing;
            }
            const viewport = this.gfx.viewport;
            const bound = Bound.deserialize(this.group.externalXYWH);
            const [x, y] = viewport.toViewCoord(bound.x, bound.y);
            const inlineEditorStyle = styleMap({
                transformOrigin: 'top left',
                borderRadius: '2px',
                width: 'fit-content',
                maxHeight: '30px',
                height: 'fit-content',
                padding: `${GROUP_TITLE_PADDING[1]}px ${GROUP_TITLE_PADDING[0]}px`,
                fontSize: GROUP_TITLE_FONT_SIZE + 'px',
                position: 'absolute',
                left: x + 'px',
                top: `${y - GROUP_TITLE_OFFSET + 2}px`,
                minWidth: '8px',
                fontFamily: 'var(--linvo-font-family)',
                color: 'var(--linvo-text-primary-color)',
                background: 'var(--linvo-white-10)',
                outline: 'none',
                zIndex: '1',
                border: `1px solid
        var(--linvo-primary-color)`,
                boxShadow: 'var(--linvo-active-shadow)',
            });
            return html `<plain-text-editor
      .text=${bindSurfaceText(this.group.title)}
      .wrapMode=${'nowrap'}
      style=${inlineEditorStyle}
    ></plain-text-editor>`;
        }
        accessor group = __runInitializers(this, _group_initializers, void 0);
        accessor std = (__runInitializers(this, _group_extraInitializers), __runInitializers(this, _std_initializers, void 0));
        accessor plainTextEditor = (__runInitializers(this, _std_extraInitializers), __runInitializers(this, _plainTextEditor_initializers, void 0));
        constructor() {
            super(...arguments);
            __runInitializers(this, _plainTextEditor_extraInitializers);
        }
    };
})();
export { EdgelessGroupTitleEditor };
