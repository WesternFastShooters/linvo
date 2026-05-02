import type { ShapeType } from '../../../definitions/shape';
import { diamond } from './diamond';
import { ellipse } from './ellipse';
import { presetShapeMethods } from './presets';
import { rect } from './rect';
import { triangle } from './triangle';

export const shapeMethods: Record<ShapeType, typeof rect> = {
  rect,
  triangle,
  ellipse,
  diamond,
  ...presetShapeMethods,
};
