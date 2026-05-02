import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { PeekViewService } from './type';

export const PeekViewProvider = createIdentifier<PeekViewService>(
  'LinvoPeekViewProvider'
);

export function PeekViewExtension(service: PeekViewService): ExtensionType {
  return {
    setup: di => {
      di.override(PeekViewProvider, () => service);
    },
  };
}
