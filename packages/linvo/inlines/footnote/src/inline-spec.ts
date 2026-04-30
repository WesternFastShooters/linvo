import { FootNoteSchema } from '@linvo/linvo-model';
import type { LinvoTextAttributes } from '@linvo/linvo-shared/types';
import { StdIdentifier } from '@linvo/std';
import { InlineSpecExtension } from '@linvo/std/inline';
import { html } from 'lit';
import z from 'zod';

import { FootNoteNodeConfigIdentifier } from './footnote-node/footnote-config';

export const FootNoteInlineSpecExtension =
  InlineSpecExtension<LinvoTextAttributes>('footnote', provider => {
    const std = provider.get(StdIdentifier);
    const config =
      provider.getOptional(FootNoteNodeConfigIdentifier) ?? undefined;
    return {
      name: 'footnote',
      schema: z.object({
        footnote: FootNoteSchema.optional().nullable().catch(undefined),
      }),
      match: delta => {
        return !!delta.attributes?.footnote;
      },
      renderer: ({ delta }) => {
        return html`<linvo-footnote-node
          .delta=${delta}
          .std=${std}
          .config=${config}
        ></linvo-footnote-node>`;
      },
      embed: true,
    };
  });
