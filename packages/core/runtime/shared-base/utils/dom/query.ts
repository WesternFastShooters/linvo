import type { RootBlockModel } from '@linvo-core/content';
import { BLOCK_ID_ATTR, type BlockComponent } from '@linvo-core/std';
import type { BlockModel } from '@linvo-core/store';

const ATTR_SELECTOR = `[${BLOCK_ID_ATTR}]`;

export function getModelByElement<Model extends BlockModel>(
  element: Element
): Model | null {
  const closestBlock = element.closest<BlockComponent>(ATTR_SELECTOR);
  if (!closestBlock) {
    return null;
  }
  return closestBlock.model as Model;
}

export function getRootByElement(
  element: Element
): BlockComponent<RootBlockModel> | null {
  const previewRoot = getPreviewRootByElement(element);
  if (previewRoot) return previewRoot;

  const edgelessRoot = getEdgelessRootByElement(element);
  if (edgelessRoot) return edgelessRoot;

  return null;
}

export function getPreviewRootByElement(
  element: Element
): BlockComponent<RootBlockModel> | null {
  return element.closest('linvo-preview-root');
}

export function getEdgelessRootByElement(
  element: Element
): BlockComponent<RootBlockModel> | null {
  return element.closest('linvo-edgeless-root');
}
