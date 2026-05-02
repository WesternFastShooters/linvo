import { generateKeyBetween } from 'fractional-indexing';

import { PlainText } from '@linvo-core/store';
import type {
  LocalElementSnapshot,
  LocalElementState,
  LocalRecordValue,
  LocalValue,
  PlainTextLike,
  PlainTextSnapshot,
} from './types';

function isPlainObject(
  value: unknown
): value is Record<string, LocalRecordValue | LocalValue | undefined> {
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

export function cloneRecordValue(value: LocalRecordValue): LocalRecordValue {
  if (isPlainTextLike(value)) {
    return value.clone();
  }

  if (Array.isArray(value)) {
    return (value as LocalRecordValue[]).map(item => cloneRecordValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, LocalRecordValue | undefined>).map(([key, item]) => [
        key,
        item === undefined ? undefined : cloneRecordValue(item),
      ])
    ) as LocalRecordValue;
  }

  return value;
}

export function serializeRecordValue(value: LocalRecordValue): LocalValue {
  if (isPlainTextLike(value)) {
    return value.toJSON();
  }

  if (Array.isArray(value)) {
    return (value as LocalRecordValue[]).map(item => serializeRecordValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, LocalRecordValue | undefined>).map(([key, item]) => [
        key,
        item === undefined ? undefined : serializeRecordValue(item),
      ])
    ) as LocalValue;
  }

  return value;
}

export function deserializeRecordValue(value: LocalValue): LocalRecordValue {
  if (isPlainTextSnapshot(value)) {
    return PlainText.from(value);
  }

  if (Array.isArray(value)) {
    return (value as LocalValue[]).map(item => deserializeRecordValue(item)) as LocalRecordValue;
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, LocalValue | undefined>).map(([key, item]) => [
        key,
        item === undefined ? undefined : deserializeRecordValue(item),
      ])
    ) as LocalRecordValue;
  }

  return value;
}

export function cloneElementState(
  state: LocalElementState | LocalElementSnapshot
): LocalElementState {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => [
      key,
      value === undefined
        ? undefined
        : cloneRecordValue(value as LocalRecordValue),
    ])
  ) as LocalElementState;
}

export function serializeElementState(
  state: LocalElementState | LocalElementSnapshot
): LocalElementSnapshot {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => [
      key,
      value === undefined ? undefined : serializeRecordValue(value as LocalRecordValue),
    ])
  ) as LocalElementSnapshot;
}

export function deserializeElementState(
  snapshot: LocalElementSnapshot
): LocalElementState {
  return Object.fromEntries(
    Object.entries(snapshot).map(([key, value]) => [
      key,
      value === undefined ? undefined : deserializeRecordValue(value as LocalValue),
    ])
  ) as LocalElementState;
}

export function createElementId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `wb_${random}`;
}

export function createOrderKey(
  before: string | null,
  after: string | null
): string {
  return generateKeyBetween(before, after);
}

export function createSeed() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

export function compareOrderKey(left: string, right: string) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}
