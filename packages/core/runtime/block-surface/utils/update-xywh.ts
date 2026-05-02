import {
  ConnectorElementModel,
  MindmapElementModel,
} from '@linvo-core/content';
import { Bound } from '@linvo-core/global/gfx';
import {
  type GfxGroupCompatibleInterface,
  type GfxModel,
  isGfxGroupCompatibleModel,
} from '@linvo-core/std/gfx';
import type { BlockModel, BlockProps } from '@linvo-core/store';

function updatChildElementsXYWH(
  container: GfxGroupCompatibleInterface,
  targetBound: Bound,
  updateElement: (id: string, props: Record<string, unknown>) => void,
  updateBlock: (
    model: BlockModel,
    callBackOrProps: (() => void) | Partial<BlockProps>
  ) => void
) {
  const containerBound = Bound.deserialize(container.xywh);
  const scaleX = targetBound.w / containerBound.w;
  const scaleY = targetBound.h / containerBound.h;
  container.childElements.forEach(child => {
    const childBound = Bound.deserialize(child.xywh);
    childBound.x = targetBound.x + scaleX * (childBound.x - containerBound.x);
    childBound.y = targetBound.y + scaleY * (childBound.y - containerBound.y);
    childBound.w = scaleX * childBound.w;
    childBound.h = scaleY * childBound.h;
    updateXYWH(child, childBound, updateElement, updateBlock);
  });
}

export function updateXYWH(
  ele: GfxModel,
  bound: Bound,
  updateElement: (id: string, props: Record<string, unknown>) => void,
  updateBlock: (
    model: BlockModel,
    callBackOrProps: (() => void) | Partial<BlockProps>
  ) => void
) {
  if (ele instanceof ConnectorElementModel) {
    ele.moveTo(bound);
  } else if (ele instanceof MindmapElementModel) {
    const rootId = ele.tree.id;
    const rootEle = ele.childElements.find(child => child.id === rootId);
    if (rootEle) {
      const rootBound = Bound.deserialize(rootEle.xywh);
      rootBound.x += bound.x - ele.x;
      rootBound.y += bound.y - ele.y;
      updateXYWH(rootEle, rootBound, updateElement, updateBlock);
    }
    ele.layout();
  } else if (isGfxGroupCompatibleModel(ele)) {
    updatChildElementsXYWH(ele, bound, updateElement, updateBlock);
    updateElement(ele.id, {
      xywh: bound.serialize(),
    });
  } else {
    updateElement(ele.id, {
      xywh: bound.serialize(),
    });
  }
}
