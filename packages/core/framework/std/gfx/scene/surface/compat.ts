import {
  isPlainTextLike,
  isPlainTextSnapshot,
  ObservableRecordMap,
  PlainText,
} from '@linvo-core/store';
import type { LocalValue } from '@linvo-core/shared/whiteboard/types';

import { SURFACE_TEXT_UNIQ_IDENTIFIER, SURFACE_YMAP_UNIQ_IDENTIFIER } from './surface-model';

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export type SurfaceMapChange = {
  action: 'add' | 'delete' | 'update';
  oldValue: unknown;
};

export type SurfaceMapEvent = {
  changes: {
    keys: Map<string, SurfaceMapChange>;
  };
  keysChanged: Set<string>;
};

export type SurfaceMapTransaction = {
  local: boolean;
};

export class ElementDataMap {
  readonly doc = {
    clientID: 'local',
  };

  private readonly _map: ObservableRecordMap<unknown>;

  private readonly _observerMap = new Map<
    (
      event: SurfaceMapEvent,
      transaction: SurfaceMapTransaction
    ) => void,
    (event: SurfaceMapEvent, local: boolean) => void
  >();

  constructor(initial: Record<string, unknown> = {}) {
    this._map = new ObservableRecordMap(initial);
  }

  clear() {
    this._map.clear();
  }

  delete(key: string) {
    return this._map.delete(key);
  }

  entries(): IterableIterator<[string, unknown]> {
    return this._map.entries();
  }

  forEach(
    callback: (value: unknown, key: string, map: ElementDataMap) => void
  ) {
    this._map.forEach((value, key) => callback(value, key, this));
  }

  get(key: string) {
    return this._map.get(key);
  }

  get size() {
    return Object.keys(this._map.toJSON()).length;
  }

  has(key: string) {
    return this._map.has(key);
  }

  keys(): IterableIterator<string> {
    return this._map.keys();
  }

  observe(
    observer: (
      event: SurfaceMapEvent,
      transaction: SurfaceMapTransaction
    ) => void
  ) {
    const wrapped = (event: SurfaceMapEvent, local: boolean) => {
      observer(event, { local });
    };

    this._observerMap.set(observer, wrapped);
    this._map.observe(wrapped);
  }

  unobserve(
    observer: (
      event: SurfaceMapEvent,
      transaction: SurfaceMapTransaction
    ) => void
  ) {
    const wrapped = this._observerMap.get(observer);
    if (!wrapped) {
      return;
    }

    this._observerMap.delete(observer);
    this._map.unobserve(wrapped);
  }

  set(key: string, value: unknown) {
    this._map.set(key, value);
    return this;
  }

  toJSON() {
    return this._map.toJSON();
  }

  values(): IterableIterator<unknown> {
    return this._map.values();
  }
}

export function deserializeSurfaceValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(item => deserializeSurfaceValue(item));
  }

  if (isPlainTextSnapshot(value)) {
    return PlainText.from(value);
  }

  if (isPlainObject(value)) {
    if (Reflect.has(value, SURFACE_TEXT_UNIQ_IDENTIFIER)) {
      return PlainText.from(
        Reflect.get(value, 'delta') as string | Array<{ insert: string }>
      );
    }

    if (Reflect.has(value, SURFACE_YMAP_UNIQ_IDENTIFIER)) {
      const json = Reflect.get(value, 'json') as Record<string, unknown>;
      return new ElementDataMap(
        Object.fromEntries(
          Object.entries(json ?? {}).map(([key, item]) => [
            key,
            deserializeSurfaceValue(item),
          ])
        )
      );
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        deserializeSurfaceValue(item),
      ])
    );
  }

  return value;
}

export function serializeSurfaceValue(value: unknown): LocalValue | unknown {
  if (isPlainTextLike(value)) {
    return value.toJSON();
  }

  if (value instanceof ElementDataMap) {
    return {
      [SURFACE_YMAP_UNIQ_IDENTIFIER]: true,
      json: Object.fromEntries(
        Object.entries(value.toJSON()).map(([key, item]) => [
          key,
          serializeSurfaceValue(item),
        ])
      ),
    };
  }

  if (value instanceof ObservableRecordMap) {
    return {
      [SURFACE_YMAP_UNIQ_IDENTIFIER]: true,
      json: Object.fromEntries(
        Object.entries(value.toJSON()).map(([key, item]) => [
          key,
          serializeSurfaceValue(item),
        ])
      ),
    };
  }

  if (Array.isArray(value)) {
    return value.map(item => serializeSurfaceValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        serializeSurfaceValue(item),
      ])
    );
  }

  return value;
}

export function createElementDataMap(record: Record<string, unknown> = {}) {
  return new ElementDataMap(
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [
        key,
        deserializeSurfaceValue(value),
      ])
    )
  );
}

export function serializeElementRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      serializeSurfaceValue(value),
    ])
  );
}
