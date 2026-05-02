import type { BlockModel } from '@linvo-core/store';

export function calculateCollapsedSiblings(model: BlockModel): BlockModel[] {
  const parent = model.parent;
  if (!parent) return [];
  const children = parent.children;
  const index = children.indexOf(model);
  if (index === -1) return [];

  const collapsedEdgeIndex = children.findIndex((child, i) => {
    if (
      i > index &&
      child.flavour === 'linvo:paragraph' &&
      typeof (child.props as { type?: string }).type === 'string' &&
      (child.props as { type?: string }).type!.startsWith('h')
    ) {
      const modelType = (model.props as { type?: string }).type ?? '';
      const childType = (child.props as { type?: string }).type ?? '';
      const modelLevel = parseInt(modelType.slice(1));
      const childLevel = parseInt(childType.slice(1));
      return childLevel <= modelLevel;
    }
    return false;
  });

  let collapsedSiblings: BlockModel[];
  if (collapsedEdgeIndex === -1) {
    collapsedSiblings = children.slice(index + 1);
  } else {
    collapsedSiblings = children.slice(index + 1, collapsedEdgeIndex);
  }

  return collapsedSiblings;
}

export function getNearestHeadingBefore(
  model: BlockModel
): BlockModel | null {
  const parent = model.parent;
  if (!parent) return null;
  const index = parent.children.indexOf(model);
  if (index === -1) return null;

  for (let i = index - 1; i >= 0; i--) {
    const sibling = parent.children[i];
    if (
      sibling.flavour === 'linvo:paragraph' &&
      typeof (sibling.props as { type?: string }).type === 'string' &&
      (sibling.props as { type?: string }).type!.startsWith('h')
    ) {
      return sibling;
    }
  }

  return null;
}
