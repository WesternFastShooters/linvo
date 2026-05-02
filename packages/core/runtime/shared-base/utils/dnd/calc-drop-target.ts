import { type Point, Rect } from '@linvo-core/global/gfx';
import type { BlockComponent } from '@linvo-core/std';
import type { BlockModel } from '@linvo-core/store';

import {
  getClosestBlockComponentByElement,
  getRectByBlockComponent,
} from '../dom';
import { getDropRectByPoint } from './get-drop-rect-by-point';
import { type DropPlacement, type DropTarget } from './types';

function getVisiblePreviousElementSibling(element: Element | null) {
  if (!element) return null;
  let prev = element.previousElementSibling;
  // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  while (prev instanceof HTMLElement && prev.offsetParent === null) {
    prev = prev.previousElementSibling;
  }
  return prev;
}

function getVisibleNextElementSibling(element: Element | null) {
  if (!element) return null;
  let next = element.nextElementSibling;
  while (next instanceof HTMLElement && next.offsetParent === null) {
    next = next.nextElementSibling;
  }
  return next;
}

/**
 * Calculates the drop target.
 */
export function calcDropTarget(
  point: Point,
  model: BlockModel,
  element: Element,
  draggingElements: BlockComponent[] = [],
  scale: number = 1
): DropTarget | null {
  let placement: DropPlacement = 'none';
  const height = 3 * scale;
  const dropResult = getDropRectByPoint(point, model, element);
  if (!dropResult) return null;
  const { rect: domRect } = dropResult;

  const distanceToTop = Math.abs(domRect.top - point.y);
  const distanceToBottom = Math.abs(domRect.bottom - point.y);
  const before = distanceToTop < distanceToBottom;

  placement = before ? 'before' : 'after';
  let offsetY = 4;

  if (placement === 'before') {
    // before
    let prev;
    let prevRect;

    prev = getVisiblePreviousElementSibling(element);
    if (prev) {
      if (
        draggingElements.length &&
        prev === draggingElements[draggingElements.length - 1]
      ) {
        placement = 'none';
      } else {
        prevRect = getRectByBlockComponent(prev);
      }
    } else {
      prev = getVisiblePreviousElementSibling(element.parentElement);
      if (prev) {
        prevRect = prev.getBoundingClientRect();
      }
    }

    if (prevRect) {
      offsetY = (domRect.top - prevRect.bottom) / 2;
    }
  } else {
    // after
    let next = getVisibleNextElementSibling(element);
    if (
      next &&
      placement === 'after' &&
      draggingElements.length &&
      next === draggingElements[0]
    ) {
      placement = 'none';
      next = null;
    }
    if (!next) {
      next = getVisibleNextElementSibling(
        getClosestBlockComponentByElement(element.parentElement)
      );
    }

    const nextRect = next ? getRectByBlockComponent(next) : null;
    if (nextRect) {
      offsetY = (nextRect.top - domRect.bottom) / 2;
    }
  }

  if (placement === 'none') return null;

  let top = domRect.top;
  if (placement === 'before') {
    top -= offsetY;
  } else {
    top += domRect.height + offsetY;
  }

  return {
    placement,
    rect: Rect.fromLWTH(domRect.left, domRect.width, top - height / 2, height),
    modelState: {
      model,
      rect: domRect,
      element: element as BlockComponent,
    },
  };
}
