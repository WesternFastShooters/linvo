import type { BlockStdScope } from '@linvo-core/std';
import type { TransformerMiddleware } from '@linvo-core/store';

export const surfaceRefToEmbed =
  (std: BlockStdScope): TransformerMiddleware =>
  ({ slots }) => {
    return () => {};
  };
