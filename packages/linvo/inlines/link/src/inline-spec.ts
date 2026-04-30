import type { LinvoTextAttributes } from '@linvo/linvo-shared/types';
import { StdIdentifier } from '@linvo/std';
import { InlineSpecExtension } from '@linvo/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const LinkInlineSpecExtension =
  InlineSpecExtension<LinvoTextAttributes>('link', provider => {
    const std = provider.get(StdIdentifier);
    return {
      name: 'link',
      schema: z.object({
        link: z.string().optional().nullable().catch(undefined),
      }),
      match: delta => {
        return !!delta.attributes?.link;
      },
      renderer: ({ delta }) => {
        return html`<linvo-link .std=${std} .delta=${delta}></linvo-link>`;
      },
    };
  });
