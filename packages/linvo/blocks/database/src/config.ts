import { ConfigExtensionFactory } from '@linvo/std';

import type { DatabaseViewExtensionOptions } from './view';

export const DatabaseConfigExtension =
  ConfigExtensionFactory<DatabaseViewExtensionOptions>('linvo:database');
