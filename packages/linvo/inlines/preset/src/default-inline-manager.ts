import { CommentInlineSpecExtension } from '@linvo/linvo-inline-comment';
import { FootNoteInlineSpecExtension } from '@linvo/linvo-inline-footnote';
import { LatexInlineSpecExtension } from '@linvo/linvo-inline-latex';
import { LinkInlineSpecExtension } from '@linvo/linvo-inline-link';
import { MentionInlineSpecExtension } from '@linvo/linvo-inline-mention';
import { ReferenceInlineSpecExtension } from '@linvo/linvo-inline-reference';
import type { LinvoTextAttributes } from '@linvo/linvo-shared/types';
import { InlineManagerExtension } from '@linvo/std/inline';

import {
  BackgroundInlineSpecExtension,
  BoldInlineSpecExtension,
  CodeInlineSpecExtension,
  ColorInlineSpecExtension,
  ItalicInlineSpecExtension,
  StrikeInlineSpecExtension,
  UnderlineInlineSpecExtension,
} from './inline-spec';

export const DefaultInlineManagerExtension =
  InlineManagerExtension<LinvoTextAttributes>({
    id: 'DefaultInlineManager',
    specs: [
      BoldInlineSpecExtension.identifier,
      ItalicInlineSpecExtension.identifier,
      UnderlineInlineSpecExtension.identifier,
      StrikeInlineSpecExtension.identifier,
      CodeInlineSpecExtension.identifier,
      BackgroundInlineSpecExtension.identifier,
      ColorInlineSpecExtension.identifier,
      LatexInlineSpecExtension.identifier,
      ReferenceInlineSpecExtension.identifier,
      LinkInlineSpecExtension.identifier,
      FootNoteInlineSpecExtension.identifier,
      MentionInlineSpecExtension.identifier,
      CommentInlineSpecExtension.identifier,
    ],
  });
