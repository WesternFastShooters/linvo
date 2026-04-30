import type { ReferenceParams } from '@linvo/linvo-model';
import { createIdentifier } from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';

export interface GenerateDocUrlService {
  generateDocUrl: (docId: string, params?: ReferenceParams) => string | void;
}

export const GenerateDocUrlProvider = createIdentifier<GenerateDocUrlService>(
  'GenerateDocUrlService'
);

export function GenerateDocUrlExtension(
  generateDocUrlProvider: GenerateDocUrlService
): ExtensionType {
  return {
    setup: di => {
      di.addImpl(GenerateDocUrlProvider, generateDocUrlProvider);
    },
  };
}
