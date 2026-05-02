export * from './history';
export * from './local-store';

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

type MapChangeAction = 'add' | 'delete' | 'update';

export type RelativePosition = {
  index: number;
  text: Text;
};

export type Transaction = {
  local: boolean;
  origin: unknown;
};

export type YEvent<T extends AbstractType> = {
  target: T;
  transaction: Transaction;
};

export type YMapEvent<T> = YEvent<Map<T>> & {
  changes: {
    keys: globalThis.Map<string, { action: MapChangeAction }>;
  };
  keys: globalThis.Map<string, { action: MapChangeAction }>;
  keysChanged: Set<string>;
};

export type YArrayDelta<T> =
  | { retain: number }
  | { delete: number }
  | { insert: T[] };

export type YArrayEvent<T> = YEvent<Array<T>> & {
  changes: {
    delta: YArrayDelta<T>[];
  };
};

export type YTextEvent = YEvent<Text>;

export type EncodedState = Record<string, EncodedSharedValue>;

type DeepObserver = (events: YEvent<AbstractType>[]) => void;
type Observer<T> = (event: T) => void;

type EncodedSharedValue =
  | { type: 'array'; value: EncodedSharedValue[] }
  | { type: 'map'; value: Record<string, EncodedSharedValue> }
  | { type: 'primitive'; value: JsonValue | undefined }
  | {
      type: 'text';
      value: {
        delta: {
          attributes?: Record<string, unknown>;
          insert: string;
        }[];
      };
    };

type TextRun = {
  attributes?: Record<string, unknown>;
  insert: string;
};

type TextChar = {
  attributes?: Record<string, unknown>;
  char: string;
};

type PendingEvent =
  | {
      target: Array<unknown>;
      type: 'array';
      delta: YArrayDelta<unknown>[];
    }
  | {
      target: Map<unknown>;
      type: 'map';
      keys: globalThis.Map<string, { action: MapChangeAction }>;
    }
  | {
      target: Text;
      type: 'text';
    };

function cloneJsonValue<T>(value: T): T {
  return structuredClone(value);
}

function cloneAttributes(
  attributes?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!attributes) {
    return undefined;
  }

  return cloneJsonValue(attributes);
}

function sameAttributes(
  left?: Record<string, unknown>,
  right?: Record<string, unknown>
) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function normalizeTextRuns(runs: TextRun[]) {
  const normalized: TextRun[] = [];

  for (const run of runs) {
    if (!run.insert.length) {
      continue;
    }

    const previous = normalized.at(-1);
    if (previous && sameAttributes(previous.attributes, run.attributes)) {
      previous.insert += run.insert;
      continue;
    }

    normalized.push({
      attributes: cloneAttributes(run.attributes),
      insert: run.insert,
    });
  }

  return normalized;
}

function runsToChars(runs: TextRun[]) {
  return runs.flatMap(run =>
    [...run.insert].map(char => ({
      attributes: cloneAttributes(run.attributes),
      char,
    }))
  );
}

function charsToRuns(chars: TextChar[]) {
  const runs: TextRun[] = [];

  for (const char of chars) {
    const previous = runs.at(-1);
    if (previous && sameAttributes(previous.attributes, char.attributes)) {
      previous.insert += char.char;
      continue;
    }

    runs.push({
      attributes: cloneAttributes(char.attributes),
      insert: char.char,
    });
  }

  return runs;
}

function mergeAttributes(
  base: Record<string, unknown> | undefined,
  patch: Record<string, unknown>
) {
  const next = {
    ...(base ?? {}),
  };

  for (const [key, value] of Object.entries(patch)) {
    if (value === false || value === undefined) {
      delete next[key];
      continue;
    }

    next[key] = value;
  }

  return Object.keys(next).length > 0 ? next : undefined;
}

function encodeValue(value: unknown): EncodedSharedValue {
  if (value instanceof Text) {
    return {
      type: 'text',
      value: {
        delta: value.toDelta(),
      },
    };
  }

  if (value instanceof Array) {
    return {
      type: 'array',
      value: value.toArray().map(encodeValue),
    };
  }

  if (value instanceof Map) {
    return {
      type: 'map',
      value: Object.fromEntries(
        [...value.entries()].map(([key, item]) => [key, encodeValue(item)])
      ),
    };
  }

  return {
    type: 'primitive',
    value:
      value === undefined
        ? undefined
        : cloneJsonValue(value as JsonValue | undefined),
  };
}

function decodeValue(value: EncodedSharedValue): unknown {
  switch (value.type) {
    case 'array': {
      const array = new Array<unknown>();
      array.insert(
        0,
        value.value.map(item => decodeValue(item))
      );
      return array;
    }
    case 'map': {
      const map = new Map<unknown>();
      Object.entries(value.value).forEach(([key, item]) => {
        map.set(key, decodeValue(item));
      });
      return map;
    }
    case 'text':
      return new Text(value.value.delta);
    case 'primitive':
      return cloneJsonValue(value.value);
  }
}

function serializeValue(value: unknown): JsonValue | undefined {
  if (value instanceof Text) {
    return value.toJSON();
  }

  if (value instanceof Array) {
    return value.toJSON();
  }

  if (value instanceof Map) {
    return value.toJSON();
  }

  return value as JsonValue | undefined;
}

function isSharedValue(value: unknown): value is AbstractType {
  return value instanceof AbstractType;
}

function attachValue(
  value: unknown,
  doc: Doc | null,
  parent: AbstractType | null,
  key: null | number | string
) {
  if (!isSharedValue(value)) {
    return value;
  }

  const next =
    value.doc && doc && value.doc !== doc ? value.clone() : value;
  next._attach(doc, parent, key);
  return next;
}

function detachValue(value: unknown) {
  if (!isSharedValue(value)) {
    return;
  }

  value._detach();
}

function isLocalOrigin(doc: Doc, origin: unknown) {
  if (!origin) {
    return true;
  }

  if (typeof origin === 'object' && origin !== null) {
    if ((origin as { proxy?: boolean }).proxy) {
      return true;
    }
    if ((origin as { remote?: boolean }).remote) {
      return false;
    }
  }

  return origin === doc.clientID;
}

export abstract class AbstractType {
  doc: Doc | null = null;

  private readonly _deepObservers = new Set<DeepObserver>();

  private readonly _observers = new Set<(event: any) => void>();

  private _parent: AbstractType | null = null;

  observe(callback: Observer<any>) {
    this._observers.add(callback);
  }

  observeDeep(callback: DeepObserver) {
    this._deepObservers.add(callback);
  }

  unobserve(callback: Observer<any>) {
    this._observers.delete(callback);
  }

  unobserveDeep(callback: DeepObserver) {
    this._deepObservers.delete(callback);
  }

  _dispatch(event: any) {
    this._observers.forEach(observer => observer(event));
    this._emitDeep([event as YEvent<AbstractType>]);
  }

  protected _emitDeep(events: YEvent<AbstractType>[]) {
    this._deepObservers.forEach(observer => observer(events));
    this._parent?._emitDeep(events);
  }

  _attach(
    doc: Doc | null,
    parent: AbstractType | null,
    _key: null | number | string
  ) {
    this.doc = doc;
    this._parent = parent;
    this._onAttach(doc);
  }

  _detach() {
    this.doc = null;
    this._parent = null;
    this._onAttach(null);
  }

  protected _onAttach(_doc: Doc | null) {}

  abstract clone(): AbstractType;
  abstract _replaceWith(next: AbstractType): void;
  abstract toJSON(): JsonValue;
}

export class Doc {
  readonly clientID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  readonly guid?: string;

  private _transactionDepth = 0;

  private readonly _shared = new globalThis.Map<string, AbstractType>();

  private _transactionOrigin: unknown = null;

  private readonly _pending = new globalThis.Map<AbstractType, PendingEvent>();

  constructor(options?: { guid?: string }) {
    this.guid = options?.guid;
  }

  getArray<T = unknown>(name: string) {
    const existing = this._shared.get(name);
    if (existing instanceof Array) {
      return existing as Array<T>;
    }

    const next = new Array<T>();
    next._attach(this, null, name);
    this._shared.set(name, next);
    return next;
  }

  getMap<T = unknown>(name: string) {
    const existing = this._shared.get(name);
    if (existing instanceof Map) {
      return existing as Map<T>;
    }

    const next = new Map<T>();
    next._attach(this, null, name);
    this._shared.set(name, next);
    return next;
  }

  getText(name: string) {
    const existing = this._shared.get(name);
    if (existing instanceof Text) {
      return existing;
    }

    const next = new Text();
    next._attach(this, null, name);
    this._shared.set(name, next);
    return next;
  }

  toJSON() {
    return Object.fromEntries(
      [...this._shared.entries()].map(([key, value]) => [key, value.toJSON()])
    );
  }

  encodeState(): EncodedState {
    return Object.fromEntries(
      [...this._shared.entries()].map(([key, value]) => [key, encodeValue(value)])
    );
  }

  transact(fn: () => void, origin: unknown = this.clientID) {
    const isRoot = this._transactionDepth === 0;
    if (isRoot) {
      this._transactionOrigin = origin;
    }

    this._transactionDepth += 1;

    try {
      fn();
    } finally {
      this._transactionDepth -= 1;

      if (!isRoot) {
        return;
      }

      const transaction: Transaction = {
        local: isLocalOrigin(this, this._transactionOrigin),
        origin: this._transactionOrigin,
      };
      this._transactionOrigin = null;
      this._flush(transaction);
    }
  }

  _mutate(fn: () => void) {
    if (this._transactionDepth > 0) {
      fn();
      return;
    }

    this.transact(fn);
  }

  _queueMapChange<T>(target: Map<T>, key: string, action: MapChangeAction) {
    const existing = this._pending.get(target);
    if (existing?.type === 'map') {
      existing.keys.set(key, { action });
      return;
    }

    this._pending.set(target, {
      target,
      type: 'map',
      keys: new globalThis.Map([[key, { action }]]),
    });
  }

  _queueArrayChange<T>(target: Array<T>, delta: YArrayDelta<T>) {
    const existing = this._pending.get(target);
    if (existing?.type === 'array') {
      existing.delta.push(delta as YArrayDelta<unknown>);
      return;
    }

    this._pending.set(target, {
      target,
      type: 'array',
      delta: [delta as YArrayDelta<unknown>],
    });
  }

  _queueTextChange(target: Text) {
    if (this._pending.has(target)) {
      return;
    }

    this._pending.set(target, {
      target,
      type: 'text',
    });
  }

  _emitDetached<TEvent extends YEvent<any>>(
    target: AbstractType,
    build: (transaction: Transaction) => TEvent
  ) {
    target._dispatch(
      build({
        local: true,
        origin: null,
      })
    );
  }

  private _flush(transaction: Transaction) {
    const pending = [...this._pending.values()];
    this._pending.clear();

    for (const entry of pending) {
      if (entry.type === 'map') {
        entry.target._dispatch({
          changes: {
            keys: entry.keys,
          },
          keys: entry.keys,
          keysChanged: new Set(entry.keys.keys()),
          target: entry.target,
          transaction,
        });
        continue;
      }

      if (entry.type === 'array') {
        entry.target._dispatch({
          changes: {
            delta: entry.delta,
          },
          target: entry.target,
          transaction,
        });
        continue;
      }

      entry.target._dispatch({
        target: entry.target,
        transaction,
      });
    }
  }

  _replaceFromEncodedState(encoded: EncodedState) {
    const nextKeys = new Set(Object.keys(encoded));

    this.transact(() => {
      for (const [name, value] of this._shared.entries()) {
        if (nextKeys.has(name)) {
          continue;
        }
        value._detach();
        this._shared.delete(name);
      }

      Object.entries(encoded).forEach(([name, value]) => {
        const existing = this._shared.get(name);
        const decoded = decodeValue(value) as AbstractType;

        if (!existing) {
          decoded._attach(this, null, name);
          this._shared.set(name, decoded);
          return;
        }

        existing._replaceWith?.(decoded);
      });
    }, { remote: true });
  }
}

export class Map<T = unknown> extends AbstractType {
  private readonly _data = new globalThis.Map<string, T>();

  get size() {
    return this._data.size;
  }

  clear() {
    const keys = [...this._data.keys()];
    keys.forEach(key => this.delete(key));
  }

  clone() {
    const next = new Map<T>();
    this._data.forEach((value, key) => {
      next.set(key, isSharedValue(value) ? (value.clone() as T) : cloneJsonValue(value));
    });
    return next;
  }

  delete(key: string) {
    if (this.doc) {
      let existed = false;
      this.doc._mutate(() => {
        const value = this._data.get(key);
        existed = this._data.delete(key);
        if (!existed) {
          return;
        }
        detachValue(value);
        this.doc!._queueMapChange(this, key, 'delete');
      });
      return existed;
    }

    const value = this._data.get(key);
    const existed = this._data.delete(key);
    if (!existed) {
      return false;
    }

    detachValue(value);

    new Doc()._emitDetached(this, transaction => ({
      changes: {
        keys: new globalThis.Map([[key, { action: 'delete' as const }]]),
      },
      keys: new globalThis.Map([[key, { action: 'delete' as const }]]),
      keysChanged: new Set([key]),
      target: this,
      transaction,
    }));
    return true;
  }

  entries() {
    return this._data.entries();
  }

  forEach(
    callback: (value: T, key: string, parent: globalThis.Map<string, T>) => void
  ) {
    this._data.forEach((value, key) => callback(value, key, this._data));
  }

  get(key: string) {
    return this._data.get(key);
  }

  has(key: string) {
    return this._data.has(key);
  }

  keys() {
    return this._data.keys();
  }

  set(key: string, value: T) {
    const existed = this._data.has(key);
    const previous = this._data.get(key);
    if (previous === value) {
      return this;
    }

    if (this.doc) {
      this.doc._mutate(() => {
        detachValue(previous);
        const next = attachValue(value, this.doc, this, key) as T;
        this._data.set(key, next);
        this.doc!._queueMapChange(this, key, existed ? 'update' : 'add');
      });
      return this;
    }

    detachValue(previous);
    const next = attachValue(value, this.doc, this, key) as T;
    this._data.set(key, next);

    new Doc()._emitDetached(this, transaction => ({
      changes: {
        keys: new globalThis.Map([
          [key, { action: (existed ? 'update' : 'add') as MapChangeAction }],
        ]),
      },
      keys: new globalThis.Map([
        [key, { action: (existed ? 'update' : 'add') as MapChangeAction }],
      ]),
      keysChanged: new Set([key]),
      target: this,
      transaction,
    }));
    return this;
  }

  toJSON() {
    return Object.fromEntries(
      [...this._data.entries()]
        .map(([key, value]) => [key, serializeValue(value)])
        .filter((entry): entry is [string, JsonValue] => entry[1] !== undefined)
    );
  }

  values() {
    return this._data.values();
  }

  _replaceWith(next: AbstractType) {
    if (!(next instanceof Map)) {
      return;
    }

    const currentKeys = new Set(this._data.keys());
    const nextKeys = new Set(next._data.keys());

    currentKeys.forEach(key => {
      if (!nextKeys.has(key)) {
        this.delete(key);
      }
    });

    next._data.forEach((value, key) => {
      this.set(
        key,
        isSharedValue(value) ? (value.clone() as T) : cloneJsonValue(value)
      );
    });
  }

  protected override _onAttach(doc: Doc | null) {
    this._data.forEach((value, key) => {
      attachValue(value, doc, this, key);
    });
  }
}

export class Array<T = unknown> extends AbstractType {
  private readonly _data: T[] = [];

  static from<T>(items: T[]) {
    const array = new Array<T>();
    array.insert(0, items);
    return array;
  }

  get length() {
    return this._data.length;
  }

  clone() {
    const next = new Array<T>();
    next.insert(
      0,
      this._data.map(item =>
        isSharedValue(item) ? (item.clone() as T) : cloneJsonValue(item)
      )
    );
    return next;
  }

  delete(index: number, length: number) {
    if (length <= 0) {
      return;
    }

    if (this.doc) {
      this.doc._mutate(() => {
        const removed = this._data.splice(index, length);
        removed.forEach(item => detachValue(item));
        this.doc!._queueArrayChange(this, { delete: length });
      });
      return;
    }

    const removed = this._data.splice(index, length);
    removed.forEach(item => detachValue(item));

    new Doc()._emitDetached(this, transaction => ({
      changes: {
        delta: [{ delete: length }],
      },
      target: this,
      transaction,
    }));
  }

  forEach(callback: (value: T, index: number, array: T[]) => void) {
    this._data.forEach((value, index) => callback(value, index, this._data));
  }

  get(index: number) {
    return this._data[index];
  }

  insert(index: number, items: T[]) {
    if (items.length === 0) {
      return;
    }

    if (this.doc) {
      this.doc._mutate(() => {
        const next = items.map((item, itemIndex) =>
          attachValue(item, this.doc, this, index + itemIndex)
        ) as T[];
        this._data.splice(index, 0, ...next);
        this.doc!._queueArrayChange(this, { insert: next });
      });
      return;
    }

    const next = items.map((item, itemIndex) =>
      attachValue(item, this.doc, this, index + itemIndex)
    ) as T[];
    this._data.splice(index, 0, ...next);

    new Doc()._emitDetached(this, transaction => ({
      changes: {
        delta: [{ insert: next }],
      },
      target: this,
      transaction,
    }));
  }

  push(items: T[]) {
    this.insert(this._data.length, items);
  }

  toArray() {
    return [...this._data];
  }

  toJSON() {
    return this._data
      .map(item => serializeValue(item))
      .filter((item): item is JsonValue => item !== undefined);
  }

  _replaceWith(next: AbstractType) {
    if (!(next instanceof Array)) {
      return;
    }

    this.delete(0, this._data.length);
    this.insert(
      0,
      next._data.map(item =>
        isSharedValue(item) ? (item.clone() as T) : cloneJsonValue(item)
      )
    );
  }

  protected override _onAttach(doc: Doc | null) {
    this._data.forEach((value, index) => {
      attachValue(value, doc, this, index);
    });
  }
}

export class Text extends AbstractType {
  private _runs: TextRun[] = [];

  get length() {
    return this.toString().length;
  }

  constructor(
    input:
      | string
      | {
          attributes?: Record<string, unknown>;
          insert: string;
        }[] = ''
  ) {
    super();
    this._runs =
      typeof input === 'string'
        ? input.length
          ? [{ insert: input }]
          : []
        : normalizeTextRuns(
            input.map(item => ({
              attributes: cloneAttributes(item.attributes),
              insert: item.insert,
            }))
          );
  }

  applyDelta(
    delta: {
      attributes?: Record<string, unknown>;
      delete?: number;
      insert?: string;
      retain?: number;
    }[]
  ) {
    const apply = () => {
      const source = runsToChars(this._runs);
      const next: TextChar[] = [];
      let cursor = 0;

      for (const operation of delta) {
        if (operation.retain) {
          next.push(...source.slice(cursor, cursor + operation.retain));
          cursor += operation.retain;
        }

        if (operation.delete) {
          cursor += operation.delete;
        }

        if (operation.insert) {
          next.push(
            ...[...operation.insert].map(char => ({
              attributes: cloneAttributes(operation.attributes),
              char,
            }))
          );
        }
      }

      next.push(...source.slice(cursor));
      this._replaceChars(next);
    };

    this.doc ? this.doc._mutate(apply) : apply();
  }

  clone() {
    return new Text(this.toDelta());
  }

  delete(index: number, length: number) {
    if (length <= 0) {
      return;
    }

    const apply = () => {
      const chars = runsToChars(this._runs);
      chars.splice(index, length);
      this._replaceChars(chars);
    };
    this.doc ? this.doc._mutate(apply) : apply();
  }

  format(index: number, length: number, attributes: Record<string, unknown>) {
    if (length <= 0) {
      return;
    }

    const apply = () => {
      const chars = runsToChars(this._runs);
      for (let offset = index; offset < index + length; offset += 1) {
        const current = chars[offset];
        if (!current) {
          continue;
        }
        current.attributes = mergeAttributes(current.attributes, attributes);
      }
      this._replaceChars(chars);
    };
    this.doc ? this.doc._mutate(apply) : apply();
  }

  insert(
    index: number,
    content: string,
    attributes?: Record<string, unknown>
  ) {
    if (!content.length) {
      return;
    }

    const apply = () => {
      const chars = runsToChars(this._runs);
      chars.splice(
        index,
        0,
        ...[...content].map(char => ({
          attributes: cloneAttributes(attributes),
          char,
        }))
      );
      this._replaceChars(chars);
    };
    this.doc ? this.doc._mutate(apply) : apply();
  }

  toDelta() {
    return this._runs.map(run => {
      const attributes = cloneAttributes(run.attributes);
      return attributes
        ? {
            attributes,
            insert: run.insert,
          }
        : {
            insert: run.insert,
          };
    });
  }

  toJSON() {
    return this.toString();
  }

  toString() {
    return this._runs.map(run => run.insert).join('');
  }

  _replaceWith(next: AbstractType) {
    if (!(next instanceof Text)) {
      return;
    }

    this._runs = next.toDelta();
    this._emitChange();
  }

  private _emitChange() {
    if (this.doc) {
      this.doc._queueTextChange(this);
      return;
    }

    new Doc()._emitDetached(this, transaction => ({
      target: this,
      transaction,
    }));
  }

  private _replaceChars(chars: TextChar[]) {
    this._runs = charsToRuns(chars);
    this._emitChange();
  }
}

export function createAbsolutePositionFromRelativePosition(
  position: RelativePosition | null,
  _doc: Doc
) {
  if (!position) {
    return null;
  }

  return {
    index: position.index,
  };
}

export function createRelativePositionFromTypeIndex(text: Text, index: number) {
  return {
    index,
    text,
  } satisfies RelativePosition;
}

export function encodeStateAsUpdate(doc: Doc) {
  return doc.encodeState();
}

export function applyUpdate(doc: Doc, update: EncodedState) {
  doc._replaceFromEncodedState(update);
}

export * from './history';
export * from './local-store';
