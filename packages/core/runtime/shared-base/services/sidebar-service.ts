import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

export interface SidebarService {
  open: (tabId?: string) => void;
  close: () => void;
  getTabIds: () => string[];
}

export const SidebarExtensionIdentifier = createIdentifier<SidebarService>(
  'LinvoSidebarExtension'
);

export const SidebarExtension = (service: SidebarService): ExtensionType => ({
  setup: di => {
    di.addImpl(SidebarExtensionIdentifier, () => service);
  },
});
