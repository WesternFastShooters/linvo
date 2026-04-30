import { StoreExtensionManager } from '@linvo/linvo/ext-loader';
import { getInternalStoreExtensions } from '@linvo/linvo/extensions/store';

const manager = new StoreExtensionManager(getInternalStoreExtensions());

export function getTestStoreManager() {
  return manager;
}
