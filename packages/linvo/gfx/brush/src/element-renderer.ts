import {
  type ElementRenderer,
  ElementRendererExtension,
} from '@linvo/linvo-block-surface';
import { type BrushElementModel, DefaultTheme } from '@linvo/linvo-model';

export const brush: ElementRenderer<BrushElementModel> = (
  model,
  ctx,
  matrix,
  renderer
) => {
  const { rotate } = model;
  const [, , w, h] = model.deserializedXYWH;
  const cx = w / 2;
  const cy = h / 2;

  ctx.setTransform(
    matrix.translateSelf(cx, cy).rotateSelf(rotate).translateSelf(-cx, -cy)
  );

  const color = renderer.getColorValue(model.color, DefaultTheme.black, true);

  ctx.fillStyle = color;

  ctx.fill(new Path2D(model.commands));
};

export const BrushElementRendererExtension = ElementRendererExtension(
  'brush',
  brush
);
