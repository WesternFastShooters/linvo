import { ConfigExtensionFactory } from '@linvo/std';

import type { ToolbarMoreMenuConfig } from './types';

export const ToolbarMoreMenuConfigExtension = ConfigExtensionFactory<
  Partial<ToolbarMoreMenuConfig>
>('linvo-toolbar-more-menu');
