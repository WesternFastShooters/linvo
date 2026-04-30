import { createIdentifier } from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';

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
