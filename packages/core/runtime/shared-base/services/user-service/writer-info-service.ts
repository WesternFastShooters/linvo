import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { LinvoUserInfo } from './types';

export interface WriterInfoService {
  getWriterInfo(): LinvoUserInfo | null;
}

export const WriterInfoProvider = createIdentifier<WriterInfoService>(
  'linvo-writer-info-service'
);

export function WriterInfoServiceExtension(
  service: WriterInfoService
): ExtensionType {
  return {
    setup(di) {
      di.addImpl(WriterInfoProvider, () => service);
    },
  };
}
