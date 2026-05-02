import type { BaseTextAttributes } from './attributes';

export interface OptionalAttributes {
  attributes?: Record<string, any>;
}

export type DeltaOperation = {
  insert?: string;
  delete?: number;
  retain?: number;
} & OptionalAttributes;

export type TextChangeSource = {
  length: number;
  toDelta(): DeltaOperation[];
  toString(): string;
};

export type OnTextChange = (
  data: TextChangeSource,
  isLocal: boolean
) => void;

export type DeltaInsert<
  TextAttributes extends BaseTextAttributes = BaseTextAttributes,
> = {
  insert: string;
  attributes?: TextAttributes;
};

export type PlainTextDelta = {
  attributes?: Record<string, unknown>;
  insert: string;
};

export type PlainTextSnapshot = {
  text: string;
  type: 'plain-text';
};

export type PlainTextLike = {
  clone(): PlainTextLike;
  toJSON(): PlainTextSnapshot;
  toString(): string;
};

export type LocalTextChangeEvent = {
  local: boolean;
  text: string;
};

export type EditableTextLike = {
  length?: number;
  observe(listener: (event: LocalTextChangeEvent) => void): (() => void) | void;
  set(text: string, local?: boolean): void;
  toString(): string;
};
