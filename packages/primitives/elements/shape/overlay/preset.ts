import type { RoughCanvas } from '@linvo-core/block-surface';

import {
  drawPresetShapeOverlayRough,
  drawPresetShapeUnderlayRough,
  getPresetShapePoints,
  isPresetShapeType,
} from '../preset-shape-utils';
import { Shape } from './shape';
import { drawGeneralShape } from './utils';

export class PresetShape extends Shape {
  draw(ctx: CanvasRenderingContext2D, rc: RoughCanvas): void {
    if (!isPresetShapeType(this.type)) {
      throw new Error(`Unsupported preset shape type: ${this.type}`);
    }

    if (this.shapeStyle === 'Scribbled') {
      drawPresetShapeUnderlayRough(rc, this.type, this.xywh, this.options);
      rc.polygon(getPresetShapePoints(this.type, this.xywh, this.options.strokeWidth), this.options);
      drawPresetShapeOverlayRough(rc, this.type, this.xywh, this.options);
    } else {
      drawGeneralShape(ctx, this.type, this.xywh, this.options);
    }
  }
}
