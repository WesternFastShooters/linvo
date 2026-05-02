import type { ServiceIdentifier } from '@linvo-core/composition/di';

import { LifeCycleWatcherIdentifier } from '../identifier';
import type { GfxController } from './controller';

export const gfxControllerKey = 'GfxController';

export const GfxControllerIdentifier = LifeCycleWatcherIdentifier(
  gfxControllerKey
) as ServiceIdentifier<GfxController>;
