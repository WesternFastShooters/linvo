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
import { Bound } from '@linvo-core/global/gfx';
import { BoundPlainText, ObservableRecordMap, PlainText, } from '@linvo-core/store';
import { field, local, watch } from './field-decorators';
import { LocalStatefulElementModel } from './local-stateful-element-model';
function toPlainText(value, fallback = '') {
    if (typeof value === 'string') {
        return new PlainText(value);
    }
    if (value) {
        return new PlainText(value.toString());
    }
    return new PlainText(fallback);
}
function toRecordValue(value) {
    if (value instanceof ObservableRecordMap) {
        return value.toJSON();
    }
    return value ?? {};
}
let OfflineShapeElementModel = (() => {
    let _classSuper = LocalStatefulElementModel;
    let _fill_decorators;
    let _fill_initializers = [];
    let _fill_extraInitializers = [];
    let _rotate_decorators;
    let _rotate_initializers = [];
    let _rotate_extraInitializers = [];
    let _xywh_decorators;
    let _xywh_initializers = [];
    let _xywh_extraInitializers = [];
    return class OfflineShapeElementModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _fill_decorators = [field('transparent')];
            _rotate_decorators = [field(0)];
            _xywh_decorators = [field('[0,0,100,100]')];
            __esDecorate(this, null, _fill_decorators, { kind: "accessor", name: "fill", static: false, private: false, access: { has: obj => "fill" in obj, get: obj => obj.fill, set: (obj, value) => { obj.fill = value; } }, metadata: _metadata }, _fill_initializers, _fill_extraInitializers);
            __esDecorate(this, null, _rotate_decorators, { kind: "accessor", name: "rotate", static: false, private: false, access: { has: obj => "rotate" in obj, get: obj => obj.rotate, set: (obj, value) => { obj.rotate = value; } }, metadata: _metadata }, _rotate_initializers, _rotate_extraInitializers);
            __esDecorate(this, null, _xywh_decorators, { kind: "accessor", name: "xywh", static: false, private: false, access: { has: obj => "xywh" in obj, get: obj => obj.xywh, set: (obj, value) => { obj.xywh = value; } }, metadata: _metadata }, _xywh_initializers, _xywh_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        get elementBound() {
            return Bound.deserialize(this.xywh);
        }
        _getTextBinding(key) {
            const cacheKey = `${key}:binding`;
            const current = this._readField(key);
            const nextText = current?.toString() ?? '';
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new BoundPlainText(nextText, value => {
                    this._writeField(key, new PlainText(value));
                });
                this._local.set(cacheKey, binding);
                return binding;
            }
            binding.sync(nextText, false);
            return binding;
        }
        accessor fill = __runInitializers(this, _fill_initializers, 'transparent');
        accessor rotate = (__runInitializers(this, _fill_extraInitializers), __runInitializers(this, _rotate_initializers, 0));
        get text() {
            return this._getTextBinding('text');
        }
        set text(value) {
            const next = toPlainText(value);
            this._writeField('text', next);
            this._getTextBinding('text').sync(next.toString());
        }
        accessor xywh = (__runInitializers(this, _rotate_extraInitializers), __runInitializers(this, _xywh_initializers, '[0,0,100,100]'));
        constructor() {
            super(...arguments);
            __runInitializers(this, _xywh_extraInitializers);
        }
    };
})();
export { OfflineShapeElementModel };
let OfflineTextElementModel = (() => {
    let _classSuper = LocalStatefulElementModel;
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    let _xywh_decorators;
    let _xywh_initializers = [];
    let _xywh_extraInitializers = [];
    return class OfflineTextElementModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _color_decorators = [field('black')];
            _xywh_decorators = [field('[0,0,100,100]')];
            __esDecorate(this, null, _color_decorators, { kind: "accessor", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(this, null, _xywh_decorators, { kind: "accessor", name: "xywh", static: false, private: false, access: { has: obj => "xywh" in obj, get: obj => obj.xywh, set: (obj, value) => { obj.xywh = value; } }, metadata: _metadata }, _xywh_initializers, _xywh_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        _getTextBinding(key) {
            const cacheKey = `${key}:binding`;
            const current = this._readField(key, new PlainText());
            const nextText = current?.toString() ?? '';
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new BoundPlainText(nextText, value => {
                    this._writeField(key, new PlainText(value));
                });
                this._local.set(cacheKey, binding);
                return binding;
            }
            binding.sync(nextText, false);
            return binding;
        }
        accessor color = __runInitializers(this, _color_initializers, 'black');
        get text() {
            return this._getTextBinding('text');
        }
        set text(value) {
            const next = toPlainText(value);
            this._writeField('text', next);
            this._getTextBinding('text').sync(next.toString());
        }
        accessor xywh = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _xywh_initializers, '[0,0,100,100]'));
        constructor() {
            super(...arguments);
            __runInitializers(this, _xywh_extraInitializers);
        }
    };
})();
export { OfflineTextElementModel };
let OfflineConnectorElementModel = (() => {
    let _classSuper = LocalStatefulElementModel;
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    return class OfflineConnectorElementModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _source_decorators = [field()];
            _target_decorators = [field()];
            __esDecorate(this, null, _source_decorators, { kind: "accessor", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
            __esDecorate(this, null, _target_decorators, { kind: "accessor", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        _getTextBinding(key) {
            const cacheKey = `${key}:binding`;
            const current = this._readField(key);
            const nextText = current?.toString() ?? '';
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new BoundPlainText(nextText, value => {
                    this._writeField(key, new PlainText(value));
                });
                this._local.set(cacheKey, binding);
                return binding;
            }
            binding.sync(nextText, false);
            return binding;
        }
        accessor source = __runInitializers(this, _source_initializers, undefined);
        accessor target = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _target_initializers, undefined));
        get text() {
            return this._getTextBinding('text');
        }
        set text(value) {
            const next = toPlainText(value);
            this._writeField('text', next);
            this._getTextBinding('text').sync(next.toString());
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _target_extraInitializers);
        }
    };
})();
export { OfflineConnectorElementModel };
let OfflineGroupElementModel = (() => {
    let _classSuper = LocalStatefulElementModel;
    let _childIds_decorators;
    let _childIds_initializers = [];
    let _childIds_extraInitializers = [];
    let _xywh_decorators;
    let _xywh_initializers = [];
    let _xywh_extraInitializers = [];
    return class OfflineGroupElementModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _childIds_decorators = [local()];
            _xywh_decorators = [field('[0,0,100,100]')];
            __esDecorate(this, null, _childIds_decorators, { kind: "accessor", name: "childIds", static: false, private: false, access: { has: obj => "childIds" in obj, get: obj => obj.childIds, set: (obj, value) => { obj.childIds = value; } }, metadata: _metadata }, _childIds_initializers, _childIds_extraInitializers);
            __esDecorate(this, null, _xywh_decorators, { kind: "accessor", name: "xywh", static: false, private: false, access: { has: obj => "xywh" in obj, get: obj => obj.xywh, set: (obj, value) => { obj.xywh = value; } }, metadata: _metadata }, _xywh_initializers, _xywh_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        _getChildrenBinding() {
            const cacheKey = 'children:binding';
            const current = this._readField('children', {}) ?? {};
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new ObservableRecordMap(current, value => {
                    this._writeField('children', value);
                    this.setChildIds(Object.keys(value));
                });
                this._local.set(cacheKey, binding);
            }
            else {
                binding.sync(current, false);
            }
            this.setChildIds(Object.keys(current));
            return binding;
        }
        accessor childIds = __runInitializers(this, _childIds_initializers, []);
        get children() {
            return this._getChildrenBinding();
        }
        set children(value) {
            const next = toRecordValue(value);
            this._writeField('children', next);
            this._getChildrenBinding().sync(next);
        }
        get title() {
            const cacheKey = 'title:binding';
            const current = this._readField('title', new PlainText());
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new BoundPlainText(current?.toString() ?? '', value => {
                    this._writeField('title', new PlainText(value));
                });
                this._local.set(cacheKey, binding);
                return binding;
            }
            binding.sync(current?.toString() ?? '', false);
            return binding;
        }
        set title(value) {
            const next = toPlainText(value);
            this._writeField('title', next);
            this.title.sync(next.toString());
        }
        accessor xywh = (__runInitializers(this, _childIds_extraInitializers), __runInitializers(this, _xywh_initializers, '[0,0,100,100]'));
        addChild(id) {
            this.children.set(id, true);
        }
        hasChild(id) {
            return this.children.has(id);
        }
        removeChild(id) {
            this.children.delete(id);
        }
        setChildIds(ids) {
            this.childIds = ids;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _xywh_extraInitializers);
        }
    };
})();
export { OfflineGroupElementModel };
let OfflineMindmapElementModel = (() => {
    let _classSuper = LocalStatefulElementModel;
    let _childIds_decorators;
    let _childIds_initializers = [];
    let _childIds_extraInitializers = [];
    let _style_decorators;
    let _style_initializers = [];
    let _style_extraInitializers = [];
    let _layoutType_decorators;
    let _layoutType_initializers = [];
    let _layoutType_extraInitializers = [];
    let _tree_decorators;
    let _tree_initializers = [];
    let _tree_extraInitializers = [];
    let _xywh_decorators;
    let _xywh_initializers = [];
    let _xywh_extraInitializers = [];
    return class OfflineMindmapElementModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _childIds_decorators = [local()];
            _style_decorators = [watch((_, instance) => {
                    instance._rebuildTree();
                }), field('mindmap')];
            _layoutType_decorators = [watch((_, instance) => {
                    instance._rebuildTree();
                }), field('balance')];
            _tree_decorators = [local()];
            _xywh_decorators = [field('[0,0,100,100]')];
            __esDecorate(this, null, _childIds_decorators, { kind: "accessor", name: "childIds", static: false, private: false, access: { has: obj => "childIds" in obj, get: obj => obj.childIds, set: (obj, value) => { obj.childIds = value; } }, metadata: _metadata }, _childIds_initializers, _childIds_extraInitializers);
            __esDecorate(this, null, _style_decorators, { kind: "accessor", name: "style", static: false, private: false, access: { has: obj => "style" in obj, get: obj => obj.style, set: (obj, value) => { obj.style = value; } }, metadata: _metadata }, _style_initializers, _style_extraInitializers);
            __esDecorate(this, null, _layoutType_decorators, { kind: "accessor", name: "layoutType", static: false, private: false, access: { has: obj => "layoutType" in obj, get: obj => obj.layoutType, set: (obj, value) => { obj.layoutType = value; } }, metadata: _metadata }, _layoutType_initializers, _layoutType_extraInitializers);
            __esDecorate(this, null, _tree_decorators, { kind: "accessor", name: "tree", static: false, private: false, access: { has: obj => "tree" in obj, get: obj => obj.tree, set: (obj, value) => { obj.tree = value; } }, metadata: _metadata }, _tree_initializers, _tree_extraInitializers);
            __esDecorate(this, null, _xywh_decorators, { kind: "accessor", name: "xywh", static: false, private: false, access: { has: obj => "xywh" in obj, get: obj => obj.xywh, set: (obj, value) => { obj.xywh = value; } }, metadata: _metadata }, _xywh_initializers, _xywh_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        _getChildrenBinding() {
            const cacheKey = 'children:binding';
            const current = this._readField('children', {}) ?? {};
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new ObservableRecordMap(current, value => {
                    this._writeField('children', value);
                    this.setChildIds(Object.keys(value));
                    this._rebuildTree();
                });
                this._local.set(cacheKey, binding);
            }
            else {
                binding.sync(current, false);
            }
            this.setChildIds(Object.keys(current));
            return binding;
        }
        accessor childIds = __runInitializers(this, _childIds_initializers, []);
        get children() {
            return this._getChildrenBinding();
        }
        set children(value) {
            const next = toRecordValue(value);
            this._writeField('children', next);
            this._getChildrenBinding().sync(next);
        }
        accessor style = (__runInitializers(this, _childIds_extraInitializers), __runInitializers(this, _style_initializers, 'mindmap'));
        accessor layoutType = (__runInitializers(this, _style_extraInitializers), __runInitializers(this, _layoutType_initializers, 'balance'));
        accessor tree = (__runInitializers(this, _layoutType_extraInitializers), __runInitializers(this, _tree_initializers, []));
        accessor xywh = (__runInitializers(this, _tree_extraInitializers), __runInitializers(this, _xywh_initializers, '[0,0,100,100]'));
        addNode(id, detail) {
            this.children.set(id, detail);
        }
        removeNode(id) {
            const next = this.children.toJSON();
            delete next[id];
            Object.keys(next).forEach(key => {
                if (next[key]?.parent === id) {
                    next[key] = {
                        ...next[key],
                        parent: undefined,
                    };
                }
            });
            this.children = next;
        }
        setChildIds(ids) {
            this.childIds = ids;
            this._rebuildTree();
        }
        _rebuildTree() {
            const nodeMap = new Map();
            Object.entries(this.children.toJSON()).forEach(([id, detail]) => {
                nodeMap.set(id, {
                    children: [],
                    detail,
                    id,
                });
            });
            const roots = [];
            nodeMap.forEach(node => {
                if (node.detail.parent && nodeMap.has(node.detail.parent)) {
                    nodeMap.get(node.detail.parent).children.push(node);
                    return;
                }
                roots.push(node);
            });
            this.tree = roots;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _xywh_extraInitializers);
        }
    };
})();
export { OfflineMindmapElementModel };
let OfflineFrameElementModel = (() => {
    let _classSuper = LocalStatefulElementModel;
    let _background_decorators;
    let _background_initializers = [];
    let _background_extraInitializers = [];
    let _childIds_decorators;
    let _childIds_initializers = [];
    let _childIds_extraInitializers = [];
    let _xywh_decorators;
    let _xywh_initializers = [];
    let _xywh_extraInitializers = [];
    return class OfflineFrameElementModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _background_decorators = [field('transparent')];
            _childIds_decorators = [local()];
            _xywh_decorators = [field('[0,0,100,100]')];
            __esDecorate(this, null, _background_decorators, { kind: "accessor", name: "background", static: false, private: false, access: { has: obj => "background" in obj, get: obj => obj.background, set: (obj, value) => { obj.background = value; } }, metadata: _metadata }, _background_initializers, _background_extraInitializers);
            __esDecorate(this, null, _childIds_decorators, { kind: "accessor", name: "childIds", static: false, private: false, access: { has: obj => "childIds" in obj, get: obj => obj.childIds, set: (obj, value) => { obj.childIds = value; } }, metadata: _metadata }, _childIds_initializers, _childIds_extraInitializers);
            __esDecorate(this, null, _xywh_decorators, { kind: "accessor", name: "xywh", static: false, private: false, access: { has: obj => "xywh" in obj, get: obj => obj.xywh, set: (obj, value) => { obj.xywh = value; } }, metadata: _metadata }, _xywh_initializers, _xywh_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        accessor background = __runInitializers(this, _background_initializers, 'transparent');
        _getChildrenBinding() {
            const cacheKey = 'childElementIds:binding';
            const current = this._readField('childElementIds', {}) ?? {};
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new ObservableRecordMap(current, value => {
                    this._writeField('childElementIds', value);
                    this.setChildIds(Object.keys(value));
                });
                this._local.set(cacheKey, binding);
            }
            else {
                binding.sync(current, false);
            }
            this.setChildIds(Object.keys(current));
            return binding;
        }
        accessor childIds = (__runInitializers(this, _background_extraInitializers), __runInitializers(this, _childIds_initializers, []));
        get childElementIds() {
            return this._getChildrenBinding();
        }
        set childElementIds(value) {
            const next = toRecordValue(value);
            this._writeField('childElementIds', next);
            this._getChildrenBinding().sync(next);
        }
        get title() {
            const cacheKey = 'title:binding';
            const current = this._readField('title', new PlainText());
            let binding = this._local.get(cacheKey);
            if (!binding) {
                binding = new BoundPlainText(current?.toString() ?? '', value => {
                    this._writeField('title', new PlainText(value));
                });
                this._local.set(cacheKey, binding);
                return binding;
            }
            binding.sync(current?.toString() ?? '', false);
            return binding;
        }
        set title(value) {
            const next = toPlainText(value);
            this._writeField('title', next);
            this.title.sync(next.toString());
        }
        accessor xywh = (__runInitializers(this, _childIds_extraInitializers), __runInitializers(this, _xywh_initializers, '[0,0,100,100]'));
        addChild(id) {
            this.childElementIds.set(id, true);
        }
        removeChild(id) {
            this.childElementIds.delete(id);
        }
        setChildIds(ids) {
            this.childIds = ids;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _xywh_extraInitializers);
        }
    };
})();
export { OfflineFrameElementModel };
export function registerDefaultElementModels(surface) {
    surface.registerElementModel('connector', (nextSurface, state) => {
        return new OfflineConnectorElementModel(nextSurface, state);
    });
    surface.registerElementModel('frame', (nextSurface, state) => {
        return new OfflineFrameElementModel(nextSurface, state);
    });
    surface.registerElementModel('group', (nextSurface, state) => {
        return new OfflineGroupElementModel(nextSurface, state);
    });
    surface.registerElementModel('mindmap', (nextSurface, state) => {
        return new OfflineMindmapElementModel(nextSurface, state);
    });
    surface.registerElementModel('shape', (nextSurface, state) => {
        return new OfflineShapeElementModel(nextSurface, state);
    });
    surface.registerElementModel('text', (nextSurface, state) => {
        return new OfflineTextElementModel(nextSurface, state);
    });
}
