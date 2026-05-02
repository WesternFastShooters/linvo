import type { ReferenceParams } from '@linvo-core/content';
import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

export interface ParseDocUrlService {
  parseDocUrl: (
    url: string
  ) => ({ docId: string } & ReferenceParams) | undefined;
}

export const ParseDocUrlProvider =
  createIdentifier<ParseDocUrlService>('ParseDocUrlService');

export function ParseDocUrlExtension(
  parseDocUrlService: ParseDocUrlService
): ExtensionType {
  return {
    setup: di => {
      di.addImpl(ParseDocUrlProvider, parseDocUrlService);
    },
  };
}
