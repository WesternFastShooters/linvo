import type { Point } from '@linvo-core/global/gfx';
import type { BlockModel } from '@linvo-core/store';

import { getRectByBlockComponent } from '../dom';
import { DropFlags } from './types';

/**
 * Gets the drop rect by block and point.
 */
export function getDropRectByPoint(
  point: Point,
  model: BlockModel,
  element: Element
): null | {
  rect: DOMRect;
  flag: DropFlags;
} {
  const result = {
    rect: getRectByBlockComponent(element),
    flag: DropFlags.Normal,
  };

  return result;
}
