import type { SerializedXYWH } from '@linvo-core/global/gfx';

export type LocalPrimitive = boolean | null | number | string;

export type PlainTextSnapshot = {
  text: string;
  type: 'plain-text';
};

export type PlainTextLike = {
  clone(): PlainTextLike;
  toJSON(): PlainTextSnapshot;
  toString(): string;
};

export type LocalValue =
  | LocalPrimitive
  | {
      text: string;
      type: 'plain-text';
    }
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
  xywh?: SerializedXYWH;
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
  xywh?: SerializedXYWH;
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

export type LocalTextChangeEvent = {
  local: boolean;
  text: string;
};
