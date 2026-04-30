import type { LinvoTextAttributes } from '@linvo/linvo-shared/types';
import { StdIdentifier } from '@linvo/std';
import { InlineSpecExtension } from '@linvo/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const MentionInlineSpecExtension =
  InlineSpecExtension<LinvoTextAttributes>('mention', provider => {
    const std = provider.get(StdIdentifier);
    return {
      name: 'mention',
      schema: z.object({
        mention: z
          .object({
            member: z.string(),
            notification: z.string().optional(),
          })
          .optional()
          .nullable()
          .catch(undefined),
      }),
      match: delta => {
        return !!delta.attributes?.mention?.member;
      },
      renderer: ({ delta, selected }) => {
        return html`<linvo-mention
          .delta=${delta}
          .std=${std}
          .selected=${selected}
        ></linvo-mention>`;
      },
      embed: true,
    };
  });
