import { createIdentifier } from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';

import type { PeekViewService } from './type.js';

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
