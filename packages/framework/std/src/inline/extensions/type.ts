import type {
  AttributeRenderer,
  InlineEditor,
  InlineRange,
} from '@linvo/std/inline';
import type { BaseTextAttributes, DeltaInsert } from '@linvo/store';
import type * as Y from 'yjs';
import type { AnyZodObject, KeySchema, ZodEffects, ZodRecord } from 'zod';

export type InlineSpecs<
  TextAttributes extends BaseTextAttributes = BaseTextAttributes,
> = {
  name: keyof TextAttributes | string;
  schema:
    | AnyZodObject
    | ZodEffects<
        ZodRecord<KeySchema>,
        Partial<Record<string, unknown>>,
        unknown
      >;
  match: (delta: DeltaInsert<TextAttributes>) => boolean;
  renderer: AttributeRenderer<TextAttributes>;
  embed?: boolean;
  wrapper?: boolean;
};

export type InlineMarkdownMatchAction<
  // @ts-expect-error We allow to covariance for LinvoTextAttributes
  in LinvoTextAttributes extends BaseTextAttributes = BaseTextAttributes,
> = (props: {
  inlineEditor: InlineEditor<LinvoTextAttributes>;
  prefixText: string;
  inlineRange: InlineRange;
  pattern: RegExp;
  undoManager: Y.UndoManager;
}) => void;

export type InlineMarkdownMatch<
  LinvoTextAttributes extends BaseTextAttributes = BaseTextAttributes,
> = {
  name: string;
  pattern: RegExp;
  action: InlineMarkdownMatchAction<LinvoTextAttributes>;
};
