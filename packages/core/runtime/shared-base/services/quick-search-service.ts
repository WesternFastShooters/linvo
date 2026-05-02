import type { ReferenceParams } from '@linvo-core/content';
import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

export interface QuickSearchService {
  openQuickSearch: () => Promise<QuickSearchResult>;
}

export type QuickSearchResult =
  | {
      docId: string;
      params?: ReferenceParams;
    }
  | {
      externalUrl: string;
    }
  | null;

export const QuickSearchProvider = createIdentifier<QuickSearchService>(
  'LinvoQuickSearchService'
);

export function QuickSearchExtension(
  quickSearchService: QuickSearchService
): ExtensionType {
  return {
    setup: di => {
      di.addImpl(QuickSearchProvider, quickSearchService);
    },
  };
}
