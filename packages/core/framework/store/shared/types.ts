import type { BaseTextAttributes } from '../reactive/text/attributes';
import type {
  EditableTextLike,
  LocalTextChangeEvent,
  PlainTextLike,
} from '../reactive/text/types';

export type LocalPrimitive = boolean | null | number | string;

export type PlainTextDelta = {
  attributes?: Record<string, unknown>;
  insert: string;
};

export type PlainTextSnapshot = {
  text: string;
  type: 'plain-text';
};

export type LocalValue =
  | LocalPrimitive
  | PlainTextSnapshot
  | LocalValue[]
  | { [key: string]: LocalValue };

export type LocalRecordValue =
  | LocalPrimitive
  | PlainTextLike
  | LocalRecordValue[]
  | { [key: string]: LocalRecordValue };

export type LocalElementState = {
  id: string;
  index: string;
  lockedBySelf?: boolean;
  seed: number;
  type: string;
  xywh?: string;
} & Record<string, LocalRecordValue | undefined>;

export type LocalElementSnapshot = {
  [K in keyof LocalElementState]: K extends keyof Record<string, never>
    ? LocalValue
    : LocalValue;
} & {
  id: string;
  index: string;
  lockedBySelf?: boolean;
  seed: number;
  type: string;
  xywh?: string;
};

export type LocalSurfaceSnapshot = {
  elementOrder: string[];
  elements: Record<string, LocalElementSnapshot>;
  version: 1;
};

export type LocalSurfaceMiddlewareContext = {
  payload: {
    props: Partial<LocalElementState> & Pick<LocalElementState, 'type'>;
  };
  type: 'beforeAdd';
};

export type LocalTransactionCommit = {
  captureHistory: boolean;
  id: number;
  label?: string;
  mutationCount: number;
};

export type LocalHistoryStats = {
  canRedo: boolean;
  canUndo: boolean;
  redoDepth: number;
  undoDepth: number;
};

export type LocalElementAddedEvent = {
  id: string;
  local: boolean;
  snapshot: LocalElementSnapshot;
};

export type LocalElementRemovedEvent = {
  id: string;
  local: boolean;
  snapshot: LocalElementSnapshot;
  type: string;
};

export type LocalElementUpdatedEvent = {
  after: LocalElementSnapshot;
  before: LocalElementSnapshot;
  changedKeys: string[];
  id: string;
  local: boolean;
};

export type BaseTextLike = {
  clone(): BaseTextLike;
  toJSON(): PlainTextSnapshot;
  toString(): string;
};

export type TextAttributes = BaseTextAttributes;

export type {
  EditableTextLike,
  LocalTextChangeEvent,
  PlainTextLike,
};
