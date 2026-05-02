import type {
  BaseTextAttributes,
  DeltaInsert,
  DeltaOperation,
} from '@linvo-core/store';
import type { TemplateResult } from 'lit';

import type { InlineEditor } from './inline-editor';

export type AttributeRenderer<
  TextAttributes extends BaseTextAttributes = BaseTextAttributes,
> = (props: {
  editor: InlineEditor<TextAttributes>;
  delta: DeltaInsert<TextAttributes>;
  selected: boolean;
  startOffset: number;
  endOffset: number;
  lineIndex: number;
  children?: TemplateResult<1>;
}) => TemplateResult<1>;

export interface InlineRange {
  index: number;
  length: number;
}

export interface InlineTextChangeEvent {
  isLocal: boolean;
}

export interface InlineTextModel<
  TextAttributes extends BaseTextAttributes = BaseTextAttributes,
> {
  readonly attached: boolean;
  readonly length: number;
  delete(index: number, length: number): void;
  format(index: number, length: number, format: Record<string, unknown>): void;
  insert(
    content: string,
    index: number,
    attributes?: Record<string, unknown>
  ): void;
  createCursor(index: number): unknown;
  observe(listener: (event: InlineTextChangeEvent) => void): void;
  resolveCursor(cursor: unknown): number | null;
  toDelta(): DeltaOperation[];
  toString(): string;
  transact(fn: () => void, withoutTransact?: boolean): void;
  unobserve(listener: (event: InlineTextChangeEvent) => void): void;
}

export type DeltaEntry<
  TextAttributes extends BaseTextAttributes = BaseTextAttributes,
> = [delta: DeltaInsert<TextAttributes>, range: InlineRange];

// corresponding to [anchorNode/focusNode, anchorOffset/focusOffset]
export type NativePoint = readonly [node: Node, offset: number];
// the number here is relative to the text node
export type TextPoint = readonly [text: Text, offset: number];

export interface DomPoint {
  // which text node this point is in
  text: Text;
  // the index here is relative to the Editor, not text node
  index: number;
}
