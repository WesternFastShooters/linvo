import { createIdentifier } from '@linvo-core/composition/di';

import type { BlockSchemaType } from '../document/block/zod';
import type { ExtensionType } from './extension';

export const BlockSchemaIdentifier =
  createIdentifier<BlockSchemaType>('BlockSchema');

export function BlockSchemaExtension(
  blockSchema: BlockSchemaType
): ExtensionType {
  return {
    setup: di => {
      di.addImpl(
        BlockSchemaIdentifier(blockSchema.model.flavour),
        () => blockSchema
      );
    },
  };
}
