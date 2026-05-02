import type { Rect } from '@linvo-core/global/gfx';
import type { BlockComponent } from '@linvo-core/std';
import type { BlockModel } from '@linvo-core/store';

export interface EditingState {
  element: BlockComponent;
  model: BlockModel;
  rect: DOMRect;
}

/**
 * Returns a flag for the drop target.
 */
export enum DropFlags {
  Normal,
  Database,
  EmptyDatabase,
}

/**
 * A drop placement.
 */
export type DropPlacement = 'none' | 'before' | 'after' | 'database' | 'in';

export type DropTarget = {
  placement: DropPlacement;
  rect: Rect;
  modelState: EditingState;
};
