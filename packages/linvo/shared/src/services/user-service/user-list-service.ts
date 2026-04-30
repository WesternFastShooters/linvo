import { createIdentifier } from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';
import type { ReadonlySignal } from '@preact/signals-core';

import type { LinvoUserInfo } from './types';

export interface UserListService {
  users$: ReadonlySignal<LinvoUserInfo[]>;
  isLoading$: ReadonlySignal<boolean>;
  searchText$: ReadonlySignal<string>;
  hasMore$: ReadonlySignal<boolean>;
  loadMore(): void;
  search(keyword: string): void;
}

export const UserListProvider = createIdentifier<UserListService>(
  'linvo-user-list-service'
);

export function UserListServiceExtension(
  service: UserListService
): ExtensionType {
  return {
    setup(di) {
      di.addImpl(UserListProvider, () => service);
    },
  };
}
