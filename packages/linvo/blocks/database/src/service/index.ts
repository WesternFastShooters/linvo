import type { PropertyMetaConfig } from '@linvo/data-view';
import { createIdentifier } from '@linvo/global/di';

export interface DatabaseBlockConfigService {
  propertiesPresets: PropertyMetaConfig[];
}

export const DatabaseBlockConfigService =
  createIdentifier<DatabaseBlockConfigService>(
    'LinvoDatabaseBlockConfigService'
  );
