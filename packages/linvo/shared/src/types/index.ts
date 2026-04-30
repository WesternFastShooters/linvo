import type { FootNote, ReferenceInfo } from '@linvo/linvo-model';
import type { InlineEditor } from '@linvo/std/inline';
import type { BlockModel } from '@linvo/store';
export * from './uni-component';

export type NoteChildrenFlavour =
  | 'linvo:paragraph'
  | 'linvo:list'
  | 'linvo:code'
  | 'linvo:divider'
  | 'linvo:database'
  | 'linvo:data-view'
  | 'linvo:image'
  | 'linvo:bookmark'
  | 'linvo:attachment'
  | 'linvo:surface-ref';

export interface Viewport {
  left: number;
  top: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
}

export type ExtendedModel = BlockModel & Record<string, any>;

export type IndentContext = {
  blockId: string;
  inlineIndex: number;
  flavour: string;
  type: 'indent' | 'dedent';
};

export type LinvoTextStyleAttributes = {
  bold?: true | null;
  italic?: true | null;
  underline?: true | null;
  strike?: true | null;
  code?: true | null;
  color?: string | null;
  background?: string | null;
};

export type LinvoTextAttributes = LinvoTextStyleAttributes & {
  link?: string | null;
  reference?:
    | ({
        type: 'Subpage' | 'LinkedPage';
      } & ReferenceInfo)
    | null;
  latex?: string | null;
  footnote?: FootNote | null;
  mention?: {
    member: string;
    notification?: string;
  } | null;
  [key: `comment-${string}`]: boolean | null;
};

export type LinvoInlineEditor = InlineEditor<LinvoTextAttributes>;

export type SelectedRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  borderWidth: number;
  borderStyle: string;
  rotate: number;
};
