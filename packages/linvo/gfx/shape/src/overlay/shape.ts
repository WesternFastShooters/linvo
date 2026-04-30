import type { Options, RoughCanvas } from '@linvo/linvo-block-surface';
import type { ShapeStyle } from '@linvo/linvo-model';
import type { XYWH } from '@linvo/global/gfx';

export abstract class Shape {
  options: Options;

  shapeStyle: ShapeStyle;

  type: string;

  xywh: XYWH;

  constructor(
    xywh: XYWH,
    type: string,
    options: Options,
    shapeStyle: ShapeStyle
  ) {
    this.xywh = xywh;
    this.type = type;
    this.options = options;
    this.shapeStyle = shapeStyle;
  }

  abstract draw(ctx: CanvasRenderingContext2D, rc: RoughCanvas): void;
}
