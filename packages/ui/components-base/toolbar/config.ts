import { ConfigExtensionFactory } from '@linvo-core/std';

import type { ToolbarMoreMenuConfig } from './types';

export const ToolbarMoreMenuConfigExtension = ConfigExtensionFactory<
  Partial<ToolbarMoreMenuConfig>
>('linvo-toolbar-more-menu');
