import { DisposableGroup } from '@linvo-core/global/disposable';
import { assertType, type Constructor } from '@linvo-core/global/utils';
import type { Boxed } from '@linvo-core/store';
import { BlockModel, nanoid } from '@linvo-core/store';
import { Subject } from 'rxjs';

import {
  type GfxGroupCompatibleInterface,
  isGfxGroupCompatibleModel,
} from '../base';
import type { GfxGroupModel, GfxModel } from '../model';
import { createDecoratorState } from './decorators/common';
import { initializeObservers, initializeWatchers } from './decorators';
import {
  createElementDataMap,
  deserializeSurfaceValue,
  serializeElementRecord,
  type ElementDataMap,
} from './compat';
import {
  GfxGroupLikeElementModel,
  type GfxPrimitiveElementModel,
  syncElementFromY,
} from './element-model';
import type { GfxLocalElementModel } from './local-element-model';

/**
 * Used for text field
 */
export const SURFACE_TEXT_UNIQ_IDENTIFIER = 'linvo:surface:text';
/**
 * Used for map-like fields. E.g. group children field
 */
export const SURFACE_YMAP_UNIQ_IDENTIFIER = 'linvo:surface:ymap';

export type SurfaceBlockProps = {
  elements: Boxed<Record<string, Record<string, unknown>>>;
};

export interface ElementUpdatedData {
  id: string;
  props: Record<string, unknown>;
  oldValues: Record<string, unknown>;
  local: boolean;
}

export type MiddlewareCtx = {
  type: 'beforeAdd';
  payload: {
    type: string;
    props: Record<string, unknown>;
  };
};

export type SurfaceMiddleware = (ctx: MiddlewareCtx) => void;

export class SurfaceBlockModel extends BlockModel<SurfaceBlockProps> {
  protected _decoratorState = createDecoratorState();

  protected _elementCtorMap: Record<
    string,
    Constructor<
      GfxPrimitiveElementModel,
      ConstructorParameters<typeof GfxPrimitiveElementModel>
    >
  > = Object.create(null);

  protected _elementModels = new Map<
    string,
    {
      mount: () => void;
      unmount: () => void;
      model: GfxPrimitiveElementModel;
    }
  >();

  protected _elementTypeMap = new Map<string, GfxPrimitiveElementModel[]>();

  protected _groupLikeModels = new Map<string, GfxGroupModel>();

  protected _middlewares: SurfaceMiddleware[] = [];

  protected _surfaceBlockModel = true;

  protected localElements = new Set<GfxLocalElementModel>();

  elementAdded = new Subject<{ id: string; local: boolean }>();

  elementRemoved = new Subject<{
    id: string;
    type: string;
    model: GfxPrimitiveElementModel;
    local: boolean;
  }>();

  elementUpdated = new Subject<ElementUpdatedData>();

  localElementAdded = new Subject<GfxLocalElementModel>();

  localElementDeleted = new Subject<GfxLocalElementModel>();

  localElementUpdated = new Subject<{
    model: GfxLocalElementModel;
    props: Record<string, unknown>;
    oldValues: Record<string, unknown>;
  }>();

  get elementModels() {
    const models: GfxPrimitiveElementModel[] = [];
    this._elementModels.forEach(model => models.push(model.model));
    return models;
  }

  get elements() {
    return this.props.elements;
  }

  get localElementModels() {
    return this.localElements;
  }

  get registeredElementTypes() {
    return Object.keys(this._elementCtorMap);
  }

  override isEmpty(): boolean {
    return this._elementModels.size === 0 && this.children.length === 0;
  }

  constructor() {
    super();
    const subscription = this.created.subscribe(() => {
      this._init();
      subscription.unsubscribe();
    });
  }

  private _createElementFromProps(
    props: Record<string, unknown>,
    options: {
      onChange: (payload: {
        id: string;
        props: Record<string, unknown>;
        oldValues: Record<string, unknown>;
        local: boolean;
      }) => void;
    }
  ) {
    const { type, id, ...rest } = props;

    if (!id) {
      throw new Error('Cannot find id in props');
    }

    const yMap = createElementDataMap();
    const elementModel = this._createElementFromYMap(
      type as string,
      id as string,
      yMap,
      {
        ...options,
      }
    );

    props = this._propsToY(type as string, props);

    yMap.set('type', type);
    yMap.set('id', id);

    Object.keys(rest).forEach(key => {
      if (props[key] !== undefined) {
        // @ts-expect-error ignore
        elementModel.model[key] = props[key];
      }
    });

    return elementModel;
  }

  private _createElementFromYMap(
    type: string,
    id: string,
    yMap: ElementDataMap,
    options: {
      onChange: (payload: {
        id: string;
        props: Record<string, unknown>;
        oldValues: Record<string, unknown>;
        local: boolean;
      }) => void;
      skipFieldInit?: boolean;
    }
  ) {
    const stashed = new Map<string | symbol, unknown>();
    const Ctor = this._elementCtorMap[type];

    if (!Ctor) {
      throw new Error(`Invalid element type: ${yMap.get('type')}`);
    }
    const state = this._decoratorState;

    state.creating = true;
    state.skipField = options.skipFieldInit ?? false;

    let mounted = false;
    // @ts-expect-error ignore
    Ctor['_decoratorState'] = state;

    const elementModel = new Ctor({
      id,
      yMap,
      model: this,
      stashedStore: stashed,
      onChange: (payload: {
        props: Record<string, unknown>;
        oldValues: Record<string, unknown>;
        local: boolean;
      }) => mounted && options.onChange({ id, ...payload }),
    }) as GfxPrimitiveElementModel;

    // @ts-expect-error ignore
    delete Ctor['_decoratorState'];
    state.creating = false;
    state.skipField = false;

    const unmount = () => {
      mounted = false;
      elementModel.onDestroyed();
    };

    const mount = () => {
      initializeObservers(Ctor.prototype, elementModel);
      initializeWatchers(Ctor.prototype, elementModel);
      elementModel['_disposable'].add(
        syncElementFromY(elementModel, payload => {
          mounted &&
            options.onChange({
              id,
              ...payload,
            });
        })
      );
      mounted = true;
      elementModel.onCreated();
    };

    return {
      model: elementModel,
      mount,
      unmount,
    };
  }

  private _addToType(type: string, model: GfxPrimitiveElementModel) {
    const sameTypeElements = this._elementTypeMap.get(type) || [];

    if (sameTypeElements.indexOf(model) === -1) {
      sameTypeElements.push(model);
    }

    this._elementTypeMap.set(type, sameTypeElements);

    if (isGfxGroupCompatibleModel(model)) {
      this._groupLikeModels.set(model.id, model);
    }
  }

  private _persistElement(id: string) {
    const model = this._elementModels.get(id)?.model;
    if (!model) {
      return;
    }

    this.elements.setValue({
      ...(this.elements.getValue() ?? {}),
      [id]: serializeElementRecord(model.yMap.toJSON()),
    });
  }

  private _removeFromType(type: string, model: GfxPrimitiveElementModel) {
    const sameTypeElements = this._elementTypeMap.get(type) || [];
    const index = sameTypeElements.indexOf(model);

    if (index !== -1) {
      sameTypeElements.splice(index, 1);
    }

    if (this._groupLikeModels.has(model.id)) {
      this._groupLikeModels.delete(model.id);
    }
  }

  private _removePersistedElement(id: string) {
    const current = { ...(this.elements.getValue() ?? {}) };
    delete current[id];
    this.elements.setValue(current);
  }

  private _registerElementModel(
    id: string,
    model: {
      mount: () => void;
      unmount: () => void;
      model: GfxPrimitiveElementModel;
    },
    options: {
      emitAdded: boolean;
      local: boolean;
    }
  ) {
    this._elementModels.set(id, model);
    this._addToType(model.model.type, model.model);
    model.mount();

    if (options.emitAdded) {
      this.elementAdded.next({
        id: model.model.id,
        local: options.local,
      });
    }
  }

  private _unregisterElementModel(
    id: string,
    options: {
      emitRemoved: boolean;
      local: boolean;
    }
  ) {
    const current = this._elementModels.get(id);
    if (!current) {
      return;
    }

    const { model, unmount } = current;
    this._removeFromType(model.type, model);
    this._elementModels.delete(id);
    unmount();

    if (options.emitRemoved) {
      this.elementRemoved.next({
        id: model.id,
        local: options.local,
        model,
        type: model.type,
      });
    }
  }

  private _initElementModels() {
    const elementsRecord = this.elements.getValue() ?? {};

    Object.entries(elementsRecord).forEach(([key, val]) => {
      const elementRecord = Object.fromEntries(
        Object.entries(val).map(([propKey, propValue]) => [
          propKey,
          deserializeSurfaceValue(propValue),
        ])
      );
      const elementMap = createElementDataMap(elementRecord);
      const model = this._createElementFromYMap(
        elementRecord.type as string,
        elementRecord.id as string,
        elementMap,
        {
          onChange: payload => {
            this.elementUpdated.next(payload),
              Object.keys(payload.props).forEach(key => {
                model.model.propsUpdated.next({ key });
              });
          },
          skipFieldInit: true,
        }
      );

      this._registerElementModel(key, model, {
        emitAdded: false,
        local: false,
      });
    });

    Object.values(this.store.blocks.peek()).forEach(block => {
      if (isGfxGroupCompatibleModel(block.model)) {
        this._groupLikeModels.set(block.id, block.model);
      }
    });

    const subscription = this.store.slots.blockUpdated.subscribe(payload => {
      switch (payload.type) {
        case 'add':
          if (isGfxGroupCompatibleModel(payload.model)) {
            this._groupLikeModels.set(payload.id, payload.model);
          }

          break;
        case 'delete':
          if (isGfxGroupCompatibleModel(payload.model)) {
            this._groupLikeModels.delete(payload.id);
          }
          {
            const group = this.getGroup(payload.id);
            if (group) {
              // oxlint-disable-next-line unicorn/prefer-dom-node-remove
              group.removeChild(payload.model as GfxModel);
            }
          }

          break;
      }
    });

    this.deleted.subscribe(() => {
      subscription.unsubscribe();
    });
  }

  private _propsToY(type: string, props: Record<string, unknown>) {
    const ctor = this._elementCtorMap[type];

    if (!ctor) {
      throw new Error(`Invalid element type: ${type}`);
    }

    Object.entries(props).forEach(([key, val]) => {
      if (val instanceof Object) {
        if (Reflect.has(val, SURFACE_TEXT_UNIQ_IDENTIFIER)) {
          Reflect.set(props, key, deserializeSurfaceValue(val));
        }

        if (Reflect.has(val, SURFACE_YMAP_UNIQ_IDENTIFIER)) {
          Reflect.set(props, key, deserializeSurfaceValue(val));
        }
      }
    });

    // @ts-expect-error ignore
    return ctor.propsToY ? ctor.propsToY(props) : props;
  }

  private _watchGroupRelationChange() {
    const isGroup = (
      element: GfxPrimitiveElementModel
    ): element is GfxGroupLikeElementModel =>
      element instanceof GfxGroupLikeElementModel;

    const disposable = this.elementUpdated.subscribe(({ id, oldValues }) => {
      const element = this.getElementById(id)!;

      if (
        isGroup(element) &&
        oldValues['childIds'] &&
        element.childIds.length === 0
      ) {
        this.deleteElement(id);
      }
    });
    this.deleted.subscribe(() => {
      disposable.unsubscribe();
    });
  }

  protected _extendElement(
    ctorMap: Record<
      string,
      Constructor<
        GfxPrimitiveElementModel,
        ConstructorParameters<typeof GfxPrimitiveElementModel>
      >
    >
  ) {
    Object.assign(this._elementCtorMap, ctorMap);
  }

  protected _init() {
    this._initElementModels();
    this._watchGroupRelationChange();
  }

  getConstructor(type: string) {
    return this._elementCtorMap[type];
  }

  addElement<T extends object = Record<string, unknown>>(
    props: Partial<T> & { type: string }
  ) {
    if (this.store.readonly) {
      throw new Error('Cannot add element in readonly mode');
    }

    const middlewareCtx: MiddlewareCtx = {
      type: 'beforeAdd',
      payload: {
        type: props.type,
        props,
      },
    };

    this._middlewares.forEach(mid => mid(middlewareCtx));

    props = middlewareCtx.payload.props as Partial<T> & { type: string };

    const id = nanoid();

    // @ts-expect-error ignore
    props.id = id;

    const elementModel = this._createElementFromProps(props, {
      onChange: payload => {
        this._persistElement(id);
        this.elementUpdated.next(payload);
        Object.keys(payload.props).forEach(key => {
          elementModel.model.propsUpdated.next({ key });
        });
      },
    });

    this.store.transact(() => {
      this._registerElementModel(id, elementModel, {
        emitAdded: true,
        local: true,
      });
      this._persistElement(id);
    });

    return id;
  }

  addLocalElement(elem: GfxLocalElementModel) {
    this.localElements.add(elem);
    this.localElementAdded.next(elem);
  }

  applyMiddlewares(middlewares: SurfaceMiddleware[]) {
    this._middlewares = middlewares;
  }

  deleteElement(id: string) {
    if (this.store.readonly) {
      throw new Error('Cannot remove element in readonly mode');
    }

    if (!this.hasElementById(id)) {
      return;
    }

    this.store.transact(() => {
      const element = this.getElementById(id)!;
      const group = this.getGroup(id);

      if (element instanceof GfxGroupLikeElementModel) {
        element.childIds.forEach(childId => {
          if (this.hasElementById(childId)) {
            this.deleteElement(childId);
          } else if (this.store.hasBlock(childId)) {
            this.store.deleteBlock(this.store.getBlock(childId)!.model);
          }
        });
      }

      // oxlint-disable-next-line unicorn/prefer-dom-node-remove
      group?.removeChild(element as GfxModel);

      this._unregisterElementModel(id, {
        emitRemoved: true,
        local: true,
      });
      this._removePersistedElement(id);
    });
  }

  deleteLocalElement(elem: GfxLocalElementModel) {
    if (this.localElements.delete(elem)) {
      this.localElementDeleted.next(elem);
    }
  }

  override dispose(): void {
    super.dispose();

    this.elementAdded.complete();
    this.elementRemoved.complete();
    this.elementUpdated.complete();

    this._elementModels.forEach(({ unmount }) => unmount());
    this._elementModels.clear();
  }

  getElementById(id: string): GfxPrimitiveElementModel | null {
    return this._elementModels.get(id)?.model ?? null;
  }

  getElementsByType(type: string): GfxPrimitiveElementModel[] {
    return this._elementTypeMap.get(type) || [];
  }

  getGroup(elem: string | GfxModel): GfxGroupModel | null {
    elem =
      typeof elem === 'string'
        ? ((this.getElementById(elem) ??
            this.store.getBlock(elem)?.model) as GfxModel)
        : elem;

    if (!elem) return null;

    assertType<GfxModel>(elem);

    for (const group of this._groupLikeModels.values()) {
      if (group.hasChild(elem)) {
        return group;
      }
    }

    return null;
  }

  /**
   * Get all groups in the group chain. The last group is the top level group.
   * @param id
   * @returns
   */
  getGroups(id: string): GfxGroupModel[] {
    const groups: GfxGroupModel[] = [];
    const visited = new Set<GfxGroupModel>();
    let group = this.getGroup(id);

    while (group) {
      if (visited.has(group)) {
        console.warn('Exists a cycle in group relation');
        break;
      }
      visited.add(group);
      groups.push(group);
      group = this.getGroup(group.id);
    }

    return groups;
  }

  hasElementById(id: string): boolean {
    return this._elementModels.has(id);
  }

  isGroup(element: GfxModel): element is GfxModel & GfxGroupCompatibleInterface;
  isGroup(id: string): boolean;
  isGroup(element: string | GfxModel): boolean {
    if (typeof element === 'string') {
      const el = this.getElementById(element);
      if (el) return isGfxGroupCompatibleModel(el);

      const blockModel = this.store.getBlock(element)?.model;
      if (blockModel) return isGfxGroupCompatibleModel(blockModel);

      return false;
    } else {
      return isGfxGroupCompatibleModel(element);
    }
  }

  updateElement<T extends object = Record<string, unknown>>(
    id: string,
    props: Partial<T>
  ) {
    if (this.store.readonly) {
      throw new Error('Cannot update element in readonly mode');
    }

    const elementModel = this.getElementById(id);

    if (!elementModel) {
      throw new Error(`Element ${id} is not found`);
    }

    this.store.transact(() => {
      props = this._propsToY(
        elementModel.type,
        props as Record<string, unknown>
      ) as T;
      Object.entries(props).forEach(([key, value]) => {
        // @ts-expect-error ignore
        elementModel[key] = value;
      });
    });
  }
}
