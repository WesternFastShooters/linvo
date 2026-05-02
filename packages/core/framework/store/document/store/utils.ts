import type { z } from 'zod';

import { SYS_KEYS } from '../../consts';
import type { BlockModel } from '../block/block-model';
import type { BlockProps, BlockRecord } from '../block/types';
import type { BlockSchema } from '../block/zod';
import { internalPrimitives } from '../block/zod';

export function syncBlockProps(
  schema: z.infer<typeof BlockSchema>,
  model: BlockModel,
  yBlock: BlockRecord,
  props: Partial<BlockProps>
) {
  const defaultProps = schema.model.props?.(internalPrimitives) ?? {};

  Object.entries(props).forEach(([key, value]) => {
    if (SYS_KEYS.has(key)) return;
    if (value === undefined) return;

    // @ts-expect-error allow props
    model.props[key] = value;
  });

  // set default value
  Object.entries(defaultProps).forEach(([key, value]) => {
    const notExists =
      !yBlock.has(`prop:${key}`) || yBlock.get(`prop:${key}`) === undefined;
    if (!notExists) {
      return;
    }

    // @ts-expect-error allow props
    model[key] = value;
  });
}
