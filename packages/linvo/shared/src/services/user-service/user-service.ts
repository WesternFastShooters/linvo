import { createIdentifier } from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';
import type { Signal } from '@preact/signals-core';

import type { LinvoUserInfo } from './types';

export interface UserService {
  userInfo$(id: string): Signal<LinvoUserInfo | null>;
  isLoading$(id: string): Signal<boolean>;
  error$(id: string): Signal<string | null>; // user friendly error string
  revalidateUserInfo(id: string): void;
}

export const UserProvider = createIdentifier<UserService>(
  'linvo-user-service'
);

export function UserServiceExtension(service: UserService): ExtensionType {
  return {
    setup(di) {
      di.addImpl(UserProvider, () => service);
    },
  };
}
