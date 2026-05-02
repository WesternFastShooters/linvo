import { diamond } from './diamond';
import { ellipse } from './ellipse';
import { presetShapeMethods } from './presets';
import { rect } from './rect';
import { triangle } from './triangle';
export const shapeMethods = {
    rect,
    triangle,
    ellipse,
    diamond,
    ...presetShapeMethods,
};
