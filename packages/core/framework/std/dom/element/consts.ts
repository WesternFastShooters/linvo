import type { BlockModel } from '@linvo-core/store';
import { createContext } from '@lit/context';

import type { BlockService } from '../../extension';

export const modelContext = createContext<BlockModel>('model');
export const serviceContext = createContext<BlockService>('service');
export const blockComponentSymbol = Symbol('blockComponent');
export const WIDGET_ID_ATTR = 'data-widget-id';
export const BLOCK_ID_ATTR = 'data-block-id';
