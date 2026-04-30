import { CommentInlineSpecExtension } from '@linvo/linvo-inline-comment';
import { LatexInlineSpecExtension } from '@linvo/linvo-inline-latex';
import { LinkInlineSpecExtension } from '@linvo/linvo-inline-link';
import {
  BackgroundInlineSpecExtension,
  BoldInlineSpecExtension,
  CodeInlineSpecExtension,
  ColorInlineSpecExtension,
  ItalicInlineSpecExtension,
  StrikeInlineSpecExtension,
  UnderlineInlineSpecExtension,
} from '@linvo/linvo-inline-preset';
import type { LinvoTextAttributes } from '@linvo/linvo-shared/types';
import {
  InlineManagerExtension,
  InlineSpecExtension,
} from '@linvo/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const CodeBlockUnitSpecExtension =
  InlineSpecExtension<LinvoTextAttributes>({
    name: 'code-block-unit',
    schema: z.object({
      'code-block-uint': z.undefined(),
    }),
    match: () => true,
    renderer: ({ delta }) => {
      return html`<linvo-code-unit .delta=${delta}></linvo-code-unit>`;
    },
  });

export const CodeBlockInlineManagerExtension =
  InlineManagerExtension<LinvoTextAttributes>({
    id: 'CodeBlockInlineManager',
    enableMarkdown: false,
    specs: [
      BoldInlineSpecExtension.identifier,
      ItalicInlineSpecExtension.identifier,
      UnderlineInlineSpecExtension.identifier,
      StrikeInlineSpecExtension.identifier,
      CodeInlineSpecExtension.identifier,
      BackgroundInlineSpecExtension.identifier,
      ColorInlineSpecExtension.identifier,
      LatexInlineSpecExtension.identifier,
      LinkInlineSpecExtension.identifier,
      CodeBlockUnitSpecExtension.identifier,
      CommentInlineSpecExtension.identifier,
    ],
  });
