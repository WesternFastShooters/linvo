import { createIdentifier } from '@linvo-core/composition/di';

import type { Store } from './store';

export const StoreIdentifier = createIdentifier<Store>('Store');
