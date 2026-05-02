import { Subject } from 'rxjs';
import { LocalElementModel } from './local-element-model';
import { LocalStore } from '@linvo-core/store/compat';
import { compareOrderKey, cloneElementState, cloneRecordValue, createElementId, createOrderKey, createSeed, deserializeElementState, serializeElementState, } from '@linvo-core/shared/whiteboard/utils';
export class LocalSurfaceModel {
    constructor(store = new LocalStore()) {
        this.store = store;
        this.elementAdded = new Subject();
        this.elementRemoved = new Subject();
        this.elementUpdated = new Subject();
        this.slots = {
            elementAdded: this.elementAdded,
            elementRemoved: this.elementRemoved,
            elementUpdated: this.elementUpdated,
        };
        this._elementFactories = new Map();
        this._elementModels = new Map();
        this._elements = new Map();
        this._middlewares = [];
        this._orderedIds = [];
    }
    get elementIds() {
        return [...this._orderedIds];
    }
    get elementModels() {
        return this._orderedIds
            .map(id => this._elementModels.get(id))
            .filter((model) => Boolean(model));
    }
    get size() {
        return this._orderedIds.length;
    }
    get canRedo() {
        return this.store.canRedo;
    }
    get canUndo() {
        return this.store.canUndo;
    }
    addElement(state, options = {}) {
        let id = '';
        this.store.transact(() => {
            const context = {
                payload: {
                    props: { ...state },
                },
                type: 'beforeAdd',
            };
            this._middlewares.forEach(middleware => {
                middleware(context);
            });
            const nextState = this._normalizeState(context.payload.props);
            id = nextState.id;
            this._applyAdd(nextState, true);
            this.store.recordMutation(this._createAddMutation(nextState));
        }, options);
        return id;
    }
    clear(options = {}) {
        const snapshots = this.exportSnapshot().elementOrder
            .map(id => this.getElementSnapshot(id))
            .filter((snapshot) => Boolean(snapshot));
        this.store.transact(() => {
            [...this._orderedIds].forEach(id => {
                this._applyDelete(id, true);
            });
            if (snapshots.length > 0) {
                const mutations = snapshots.map(snapshot => this._createDeleteMutation(snapshot));
                this.store.recordMutation(this._chainMutations(mutations));
            }
        }, options);
    }
    deleteElement(id, options = {}) {
        const snapshot = this.getElementSnapshot(id);
        if (!snapshot) {
            return;
        }
        this.store.transact(() => {
            this._applyDelete(id, true);
            this.store.recordMutation(this._createDeleteMutation(snapshot));
        }, options);
    }
    dispose() {
        this.elementAdded.complete();
        this.elementRemoved.complete();
        this.elementUpdated.complete();
        this._elementModels.clear();
        this._elements.clear();
        this._orderedIds = [];
    }
    exportSnapshot() {
        const elements = Object.fromEntries(this._orderedIds.map(id => [id, this.getElementSnapshot(id)]));
        return {
            elementOrder: [...this._orderedIds],
            elements,
            version: 1,
        };
    }
    getElementById(id) {
        return this._elementModels.get(id) ?? null;
    }
    getElementSnapshot(id) {
        const state = this._elements.get(id);
        if (!state) {
            return null;
        }
        return serializeElementState(state);
    }
    getElementState(id) {
        const state = this._elements.get(id);
        if (!state) {
            return null;
        }
        return cloneElementState(state);
    }
    getElementsByType(type) {
        return this.elementModels.filter(model => model.type === type);
    }
    hasElementById(id) {
        return this._elements.has(id);
    }
    redo() {
        this.store.redo();
    }
    undo() {
        this.store.undo();
    }
    importSnapshot(snapshot, options = {}) {
        this.store.transact(() => {
            if (options.replace !== false) {
                [...this._orderedIds].forEach(id => {
                    this._applyDelete(id, true);
                });
            }
            snapshot.elementOrder.forEach(id => {
                const element = snapshot.elements[id];
                if (!element) {
                    return;
                }
                this._applyAdd(deserializeElementState(element), true);
            });
        }, {
            captureHistory: options.captureHistory ?? false,
            label: options.label ?? 'import-snapshot',
        });
    }
    registerElementModel(type, factory) {
        this._elementFactories.set(type, factory);
    }
    applyMiddlewares(middlewares) {
        this._middlewares = [...middlewares];
    }
    reorderElement(id, options = {}) {
        const current = this._elements.get(id);
        if (!current) {
            throw new Error(`Element ${id} is not found`);
        }
        const beforeSnapshot = this.getElementSnapshot(id);
        if (!beforeSnapshot) {
            return;
        }
        this.store.transact(() => {
            const nextIndex = this._createReorderedIndex(id, options.before, options.after);
            this._applyUpdate(id, {
                index: nextIndex,
            }, true);
            const afterSnapshot = this.getElementSnapshot(id);
            if (!afterSnapshot) {
                return;
            }
            this.store.recordMutation(this._createUpdateMutation(beforeSnapshot, afterSnapshot));
        }, {
            captureHistory: options.captureHistory,
            label: options.label ?? 'reorder-element',
        });
    }
    updateElement(id, props, options = {}) {
        const existing = this._elements.get(id);
        if (!existing) {
            throw new Error(`Element ${id} is not found`);
        }
        const before = serializeElementState(existing);
        this.store.transact(() => {
            this._applyUpdate(id, props, true);
            const after = this.getElementSnapshot(id);
            if (!after) {
                return;
            }
            this.store.recordMutation(this._createUpdateMutation(before, after));
        }, options);
    }
    _applyAdd(state, local) {
        const nextState = cloneElementState(state);
        this._elements.set(nextState.id, nextState);
        if (!this._orderedIds.includes(nextState.id)) {
            this._orderedIds.push(nextState.id);
            this._orderedIds.sort((left, right) => {
                const leftIndex = this._elements.get(left)?.index ?? '';
                const rightIndex = this._elements.get(right)?.index ?? '';
                return compareOrderKey(leftIndex, rightIndex);
            });
        }
        const model = this._instantiateElement(nextState);
        this._elementModels.set(nextState.id, model);
        this.elementAdded.next({
            id: nextState.id,
            local,
            snapshot: serializeElementState(nextState),
        });
    }
    _applyDelete(id, local) {
        const existing = this._elements.get(id);
        if (!existing) {
            return;
        }
        const snapshot = serializeElementState(existing);
        this._elements.delete(id);
        this._elementModels.delete(id);
        this._orderedIds = this._orderedIds.filter(current => current !== id);
        this.elementRemoved.next({
            id,
            local,
            snapshot,
            type: snapshot.type,
        });
    }
    _applyUpdate(id, props, local) {
        const existing = this._elements.get(id);
        if (!existing) {
            throw new Error(`Element ${id} is not found`);
        }
        const before = serializeElementState(existing);
        Object.entries(props).forEach(([key, value]) => {
            if (value === undefined) {
                delete existing[key];
                return;
            }
            existing[key] = cloneRecordValue(value);
        });
        this._orderedIds.sort((left, right) => {
            const leftIndex = this._elements.get(left)?.index ?? '';
            const rightIndex = this._elements.get(right)?.index ?? '';
            return compareOrderKey(leftIndex, rightIndex);
        });
        const after = serializeElementState(existing);
        const model = this._elementModels.get(id);
        Object.keys(props).forEach(key => {
            if (model &&
                '_emitPropUpdated' in model &&
                typeof model._emitPropUpdated === 'function') {
                model._emitPropUpdated(key, local);
            }
        });
        this.elementUpdated.next({
            after,
            before,
            changedKeys: Object.keys(props),
            id,
            local,
        });
    }
    _chainMutations(mutations) {
        return {
            redo: () => {
                mutations.forEach(mutation => {
                    mutation.redo();
                });
            },
            undo: () => {
                [...mutations].reverse().forEach(mutation => {
                    mutation.undo();
                });
            },
        };
    }
    _createAddMutation(state) {
        const snapshot = serializeElementState(state);
        return {
            redo: () => {
                this._applyAdd(deserializeElementState(snapshot), false);
            },
            undo: () => {
                this._applyDelete(snapshot.id, false);
            },
        };
    }
    _createDeleteMutation(snapshot) {
        return {
            redo: () => {
                this._applyDelete(snapshot.id, false);
            },
            undo: () => {
                this._applyAdd(deserializeElementState(snapshot), false);
            },
        };
    }
    _createUpdateMutation(before, after) {
        return {
            redo: () => {
                this._replaceElement(after, false);
            },
            undo: () => {
                this._replaceElement(before, false);
            },
        };
    }
    _instantiateElement(state) {
        const factory = this._elementFactories.get(state.type);
        if (factory) {
            return factory(this, state);
        }
        return new LocalElementModel(this, state);
    }
    _normalizeState(state) {
        const nextState = cloneElementState({
            ...state,
            id: state.id ?? createElementId(),
            index: state.index ??
                createOrderKey(this._orderedIds.at(-1)
                    ? (this._elements.get(this._orderedIds.at(-1))?.index ?? null)
                    : null, null),
            seed: state.seed ?? createSeed(),
            type: state.type,
        });
        return nextState;
    }
    _createReorderedIndex(id, beforeId, afterId) {
        const order = this._orderedIds.filter(current => current !== id);
        const safeBeforeId = beforeId && order.includes(beforeId) ? beforeId : null;
        const safeAfterId = afterId && order.includes(afterId) ? afterId : null;
        if (safeBeforeId && safeAfterId) {
            const beforeIndex = order.indexOf(safeBeforeId);
            const afterIndex = order.indexOf(safeAfterId);
            if (afterIndex >= beforeIndex) {
                throw new Error('after must be located before before when both are provided');
            }
        }
        const beforeIndex = safeBeforeId
            ? this._elements.get(safeBeforeId)?.index ?? null
            : null;
        const afterIndex = safeAfterId
            ? this._elements.get(safeAfterId)?.index ?? null
            : null;
        return createOrderKey(afterIndex, beforeIndex);
    }
    _replaceElement(snapshot, local) {
        const existing = this._elements.get(snapshot.id);
        if (!existing) {
            this._applyAdd(deserializeElementState(snapshot), local);
            return;
        }
        const before = serializeElementState(existing);
        const nextState = deserializeElementState(snapshot);
        Object.keys(existing).forEach(key => {
            if (!(key in nextState)) {
                delete existing[key];
            }
        });
        Object.entries(nextState).forEach(([key, value]) => {
            existing[key] = value;
        });
        if (!this._elementModels.has(snapshot.id)) {
            this._elementModels.set(snapshot.id, this._instantiateElement(existing));
        }
        const model = this._elementModels.get(snapshot.id);
        this._orderedIds.sort((left, right) => {
            const leftIndex = this._elements.get(left)?.index ?? '';
            const rightIndex = this._elements.get(right)?.index ?? '';
            return compareOrderKey(leftIndex, rightIndex);
        });
        Object.keys(snapshot).forEach(key => {
            if (model &&
                '_emitPropUpdated' in model &&
                typeof model._emitPropUpdated === 'function') {
                model._emitPropUpdated(key, local);
            }
        });
        this.elementUpdated.next({
            after: serializeElementState(existing),
            before,
            changedKeys: Object.keys(snapshot),
            id: snapshot.id,
            local,
        });
    }
}
