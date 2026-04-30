import { ViewExtensionManager } from '@linvo/linvo/ext-loader';
import { getInternalViewExtensions } from '@linvo/linvo/extensions/view';

const manager = new ViewExtensionManager(getInternalViewExtensions());

export function getTestViewManager() {
  return manager;
}
