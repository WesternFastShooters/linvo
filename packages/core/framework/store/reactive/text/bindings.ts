import { PlainText } from './plain-text';
import type {
  PlainTextDelta,
  PlainTextLike,
  PlainTextSnapshot,
} from './types';

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isPlainTextSnapshot(
  value: unknown
): value is PlainTextSnapshot {
  return (
    isPlainObject(value) &&
    value.type === 'plain-text' &&
    typeof value.text === 'string'
  );
}

export function isPlainTextLike(value: unknown): value is PlainTextLike {
  return (
    value != null &&
    typeof value === 'object' &&
    'clone' in value &&
    'toJSON' in value &&
    'toString' in value
  );
}

type RecordMapChangeAction = 'add' | 'delete' | 'update';

type RecordMapChange<V> = {
  action: RecordMapChangeAction;
  oldValue: V | undefined;
};

type RecordMapObserver<V> = (
  event: {
    changes: {
      keys: Map<string, RecordMapChange<V>>;
    };
    keysChanged: Set<string>;
  },
  local: boolean
) => void;

export class BoundPlainText implements PlainTextLike {
  private readonly _listeners = new Set<
    (event: { local: boolean; text: string }) => void
  >();

  private _text: string;

  constructor(
    text: string = '',
    private readonly _apply?: (text: string, local: boolean) => void
  ) {
    this._text = BoundPlainText.normalize(text);
  }

  private static normalize(text: string) {
    return text.replaceAll('\r\n', '\n');
  }

  private _emit(local: boolean) {
    const event = {
      local,
      text: this._text,
    };

    this._listeners.forEach(listener => {
      listener(event);
    });
  }

  get length() {
    return this._text.length;
  }

  clear(local = true) {
    this.replace(0, this.length, '', local);
  }

  clone() {
    return new PlainText(this._text);
  }

  delete(index: number, length: number, local = true) {
    this.replace(index, length, '', local);
  }

  insert(index: number, text: string, local = true) {
    this.replace(index, 0, text, local);
  }

  observe(listener: (event: { local: boolean; text: string }) => void) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  replace(index: number, length: number, text: string, local = true) {
    this._assertRange(index, length);
    const normalized = BoundPlainText.normalize(text);
    const next =
      this._text.slice(0, index) + normalized + this._text.slice(index + length);

    this.set(next, local);
  }

  set(text: string, local = true) {
    const normalized = BoundPlainText.normalize(text);
    if (normalized === this._text) {
      return;
    }

    this._text = normalized;
    this._emit(local);
    this._apply?.(normalized, local);
  }

  toDelta(): PlainTextDelta[] {
    if (this._text.length === 0) {
      return [];
    }

    return [{ insert: this._text }];
  }

  toJSON(): PlainTextSnapshot {
    return {
      text: this._text,
      type: 'plain-text',
    };
  }

  toString() {
    return this._text;
  }

  replaceAll(text: string, local = true) {
    this.set(text, local);
  }

  sync(text: string, local = true) {
    const normalized = BoundPlainText.normalize(text);
    if (normalized === this._text) {
      return;
    }

    this._text = normalized;
    this._emit(local);
  }

  private _assertRange(index: number, length: number) {
    if (index < 0 || length < 0 || index + length > this._text.length) {
      throw new RangeError(
        `BoundPlainText range out of bounds: index=${index}, length=${length}, textLength=${this._text.length}`
      );
    }
  }
}

export class ObservableRecordMap<V = unknown> {
  readonly doc = null;

  private readonly _observers = new Set<RecordMapObserver<V>>();

  private _record: Record<string, V>;

  constructor(
    initial: Record<string, V> = {},
    private readonly _apply?: (next: Record<string, V>, local: boolean) => void
  ) {
    this._record = { ...initial };
  }

  clear(local = true) {
    if (Object.keys(this._record).length === 0) {
      return;
    }

    const changes = new Map<string, RecordMapChange<V>>();
    Object.entries(this._record).forEach(([key, value]) => {
      changes.set(key, {
        action: 'delete',
        oldValue: value,
      });
    });

    this._record = {};
    this._notify(changes, local);
    this._apply?.({}, local);
  }

  clone() {
    return { ...this._record };
  }

  delete(key: string, local = true) {
    if (!(key in this._record)) {
      return false;
    }

    const oldValue = this._record[key];
    const next = { ...this._record };
    delete next[key];
    this._record = next;
    this._notify(
      new Map([
        [
          key,
          {
            action: 'delete',
            oldValue,
          },
        ],
      ]),
      local
    );
    this._apply?.(next, local);
    return true;
  }

  entries() {
    return Object.entries(this._record)[Symbol.iterator]();
  }

  forEach(
    callback: (value: V, key: string, map: ObservableRecordMap<V>) => void
  ) {
    Object.entries(this._record).forEach(([key, value]) => {
      callback(value, key, this);
    });
  }

  get(key: string) {
    return this._record[key];
  }

  has(key: string) {
    return key in this._record;
  }

  keys() {
    return Object.keys(this._record)[Symbol.iterator]();
  }

  observe(observer: RecordMapObserver<V>) {
    this._observers.add(observer);
  }

  set(key: string, value: V, local = true) {
    const action: RecordMapChangeAction = key in this._record ? 'update' : 'add';
    const oldValue = this._record[key];

    const next = {
      ...this._record,
      [key]: value,
    };
    this._record = next;
    this._notify(
      new Map([
        [
          key,
          {
            action,
            oldValue,
          },
        ],
      ]),
      local
    );
    this._apply?.(next, local);
    return this;
  }

  sync(next: Record<string, V>, local = true) {
    const changes = new Map<string, RecordMapChange<V>>();
    const keys = new Set([
      ...Object.keys(this._record),
      ...Object.keys(next),
    ]);

    keys.forEach(key => {
      const hasCurrent = key in this._record;
      const hasNext = key in next;

      if (!hasCurrent && hasNext) {
        changes.set(key, {
          action: 'add',
          oldValue: undefined,
        });
        return;
      }

      if (hasCurrent && !hasNext) {
        changes.set(key, {
          action: 'delete',
          oldValue: this._record[key],
        });
        return;
      }

      if (this._record[key] !== next[key]) {
        changes.set(key, {
          action: 'update',
          oldValue: this._record[key],
        });
      }
    });

    if (changes.size === 0) {
      return;
    }

    this._record = { ...next };
    this._notify(changes, local);
  }

  toJSON() {
    return { ...this._record };
  }

  unobserve(observer: RecordMapObserver<V>) {
    this._observers.delete(observer);
  }

  values() {
    return Object.values(this._record)[Symbol.iterator]();
  }

  private _notify(changes: Map<string, RecordMapChange<V>>, local: boolean) {
    const event = {
      changes: {
        keys: changes,
      },
      keysChanged: new Set(changes.keys()),
    };

    this._observers.forEach(observer => {
      observer(event, local);
    });
  }
}
