import { ImageSelection } from '../../selection';
import type { GetSelectionCommand } from './types';

export const getImageSelectionsCommand: GetSelectionCommand = (ctx, next) => {
  const currentImageSelections = ctx.std.selection.filter(ImageSelection);
  if (currentImageSelections.length === 0) return;

  next({ currentImageSelections });
};
