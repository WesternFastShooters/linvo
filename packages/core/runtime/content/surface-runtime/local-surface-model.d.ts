import { Subject } from 'rxjs';
import { LocalElementModel } from './local-element-model';
import { LocalStore } from '@linvo-core/store/compat';
import type { LocalElementAddedEvent, LocalElementRemovedEvent, LocalElementSnapshot, LocalElementState, LocalElementUpdatedEvent, LocalSurfaceMiddlewareContext, LocalSurfaceSnapshot } from '@linvo-core/shared/whiteboard/types';
type ElementFactory = (surface: LocalSurfaceModel, state: LocalElementState) => LocalElementModel;
type MutationOptions = {
    captureHistory?: boolean;
    label?: string;
};
export declare class LocalSurfaceModel {
    readonly store: LocalStore;
    readonly elementAdded: Subject<LocalElementAddedEvent>;
    readonly elementRemoved: Subject<LocalElementRemovedEvent>;
    readonly elementUpdated: Subject<LocalElementUpdatedEvent>;
    readonly slots: {
        elementAdded: Subject<LocalElementAddedEvent>;
        elementRemoved: Subject<LocalElementRemovedEvent>;
        elementUpdated: Subject<LocalElementUpdatedEvent>;
    };
    private readonly _elementFactories;
    private readonly _elementModels;
    private readonly _elements;
    private _middlewares;
    private _orderedIds;
    constructor(store?: LocalStore);
    get elementIds(): string[];
    get elementModels(): LocalElementModel<LocalElementState>[];
    get size(): number;
    get canRedo(): boolean;
    get canUndo(): boolean;
    addElement<State extends LocalElementState>(state: Partial<State> & Pick<State, 'type'>, options?: MutationOptions): string;
    clear(options?: MutationOptions): void;
    deleteElement(id: string, options?: MutationOptions): void;
    dispose(): void;
    exportSnapshot(): LocalSurfaceSnapshot;
    getElementById<T extends LocalElementModel = LocalElementModel>(id: string): T | null;
    getElementSnapshot(id: string): LocalElementSnapshot | null;
    getElementState(id: string): LocalElementState | null;
    getElementsByType<T extends LocalElementModel = LocalElementModel>(type: string): T[];
    hasElementById(id: string): boolean;
    redo(): void;
    undo(): void;
    importSnapshot(snapshot: LocalSurfaceSnapshot, options?: MutationOptions & {
        replace?: boolean;
    }): void;
    registerElementModel(type: string, factory: ElementFactory): void;
    applyMiddlewares(middlewares: Array<(context: LocalSurfaceMiddlewareContext) => void>): void;
    reorderElement(id: string, options?: MutationOptions & {
        after?: string | null;
        before?: string | null;
    }): void;
    updateElement<State extends LocalElementState>(id: string, props: Partial<Omit<State, 'id' | 'type'>>, options?: MutationOptions): void;
    private _applyAdd;
    private _applyDelete;
    private _applyUpdate;
    private _chainMutations;
    private _createAddMutation;
    private _createDeleteMutation;
    private _createUpdateMutation;
    private _instantiateElement;
    private _normalizeState;
    private _createReorderedIndex;
    private _replaceElement;
}
export {};
