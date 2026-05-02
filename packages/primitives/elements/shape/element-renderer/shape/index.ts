import {
  type CanvasRenderer,
  type ElementRenderer,
  ElementRendererExtension,
  type RoughCanvas,
} from '@linvo-core/block-surface';
import {
  getFontMetrics,
  getFontString,
  getLineWidth,
  isRTL,
  measureTextInDOM,
  wrapTextDeltas,
} from '@linvo-primitives/text';
import type {
  LocalShapeElementModel,
  ShapeElementModel,
  ShapeType,
} from '@linvo-core/content';
import { DefaultTheme, ShapeType as ShapeTypeEnum, TextAlign } from '@linvo-core/content';
import type { IBound } from '@linvo-core/global/gfx';
import { Bound } from '@linvo-core/global/gfx';
import { deltaInsertsToChunks } from '@linvo-core/std/inline';

import { custom } from './custom';
import { diamond } from './diamond';
import { ellipse } from './ellipse';
import { rect } from './rect';
import { triangle } from './triangle';
import { type Colors, horizontalOffset, verticalOffset } from './utils';

const shapeRenderers: Record<
  ShapeType,
  (
    model: ShapeElementModel | LocalShapeElementModel,
    ctx: CanvasRenderingContext2D,
    matrix: DOMMatrix,
    renderer: CanvasRenderer,
    rc: RoughCanvas,
    colors: Colors
  ) => void
> = {
  diamond,
  rect,
  triangle,
  ellipse,
  [ShapeTypeEnum.Hexagon]: custom,
  [ShapeTypeEnum.Pentagon]: custom,
  [ShapeTypeEnum.Octagon]: custom,
  [ShapeTypeEnum.Parallelogram]: custom,
  [ShapeTypeEnum.LeanLeft]: custom,
  [ShapeTypeEnum.Trapezoid]: custom,
  [ShapeTypeEnum.TrapezoidAlt]: custom,
  [ShapeTypeEnum.Stadium]: custom,
  [ShapeTypeEnum.Subroutine]: custom,
  [ShapeTypeEnum.Cylinder]: custom,
  [ShapeTypeEnum.HorizontalCylinder]: custom,
  [ShapeTypeEnum.LinedCylinder]: custom,
  [ShapeTypeEnum.Document]: custom,
  [ShapeTypeEnum.LinedDocument]: custom,
  [ShapeTypeEnum.MultiDocument]: custom,
  [ShapeTypeEnum.Note]: custom,
  [ShapeTypeEnum.Package]: custom,
  [ShapeTypeEnum.Cloud]: custom,
  [ShapeTypeEnum.DoubleCircle]: custom,
  [ShapeTypeEnum.FilledCircle]: custom,
  [ShapeTypeEnum.Asymmetric]: custom,
  [ShapeTypeEnum.Hourglass]: custom,
  [ShapeTypeEnum.NotchedRect]: custom,
  [ShapeTypeEnum.NotchedPentagon]: custom,
  [ShapeTypeEnum.Bolt]: custom,
  [ShapeTypeEnum.Bang]: custom,
  [ShapeTypeEnum.Flag]: custom,
  [ShapeTypeEnum.BowRect]: custom,
  [ShapeTypeEnum.SmallCircle]: custom,
  [ShapeTypeEnum.FramedCircle]: custom,
  [ShapeTypeEnum.CrossedCircle]: custom,
  [ShapeTypeEnum.TaggedDocument]: custom,
  [ShapeTypeEnum.TaggedRect]: custom,
  [ShapeTypeEnum.BraceLeft]: custom,
  [ShapeTypeEnum.BraceRight]: custom,
  [ShapeTypeEnum.Braces]: custom,
  [ShapeTypeEnum.Delay]: custom,
  [ShapeTypeEnum.CurvedTrapezoid]: custom,
  [ShapeTypeEnum.DividedRect]: custom,
  [ShapeTypeEnum.ForkJoin]: custom,
  [ShapeTypeEnum.WindowPane]: custom,
  [ShapeTypeEnum.LinedRect]: custom,
  [ShapeTypeEnum.FlippedTriangle]: custom,
  [ShapeTypeEnum.SlopedRect]: custom,
  [ShapeTypeEnum.StackedRect]: custom,
  [ShapeTypeEnum.Odd]: custom,
};

export const shape: ElementRenderer<ShapeElementModel> = (
  model,
  ctx,
  matrix,
  renderer,
  rc
) => {
  const color = renderer.getColorValue(
    model.color,
    DefaultTheme.shapeTextColor,
    true
  );
  const fillColor = renderer.getColorValue(
    model.fillColor,
    DefaultTheme.shapeFillColor,
    true
  );
  const strokeColor = renderer.getColorValue(
    model.strokeColor,
    DefaultTheme.shapeStrokeColor,
    true
  );
  const colors = { color, fillColor, strokeColor };

  shapeRenderers[model.shapeType](model, ctx, matrix, renderer, rc, colors);

  if (model.textDisplay) {
    renderText(model, ctx, colors);
  }
};

export const ShapeElementRendererExtension = ElementRendererExtension(
  'shape',
  shape
);

export * from './utils';

function renderText(
  model: ShapeElementModel | LocalShapeElementModel,
  ctx: CanvasRenderingContext2D,
  { color }: Colors
) {
  const {
    x,
    y,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    textAlign,
    w,
    h,
    textVerticalAlign,
    padding,
  } = model;
  if (!text) return;

  const [verticalPadding, horPadding] = padding;
  const font = getFontString(model);
  const { lineGap, lineHeight } = measureTextInDOM(
    fontFamily,
    fontSize,
    fontWeight
  );
  const metrics = getFontMetrics(fontFamily, fontSize, fontWeight);
  const lines =
    typeof text === 'string'
      ? [text.split('\n').map(line => ({ insert: line }))]
      : deltaInsertsToChunks(wrapTextDeltas(text, font, w - horPadding * 2));
  const horOffset = horizontalOffset(model.w, model.textAlign, horPadding);
  const vertOffset =
    verticalOffset(
      lines,
      lineHeight + lineGap,
      h,
      textVerticalAlign,
      verticalPadding
    ) +
    metrics.fontBoundingBoxAscent +
    lineGap / 2;
  let maxLineWidth = 0;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'alphabetic';

  for (const [lineIndex, line] of lines.entries()) {
    for (const delta of line) {
      const str = delta.insert;
      const rtl = isRTL(str);
      const shouldTemporarilyAttach = rtl && !ctx.canvas.isConnected;
      if (shouldTemporarilyAttach) {
        // to correctly render RTL text mixed with LTR, we have to append it
        // to the DOM
        document.body.append(ctx.canvas);
      }

      if (ctx.canvas.dir !== (rtl ? 'rtl' : 'ltr')) {
        ctx.canvas.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      }

      ctx.fillText(
        str,
        // 0.5 is the dom editor padding to make the text align with the DOM text
        horOffset + 0.5,
        lineIndex * lineHeight + vertOffset
      );

      maxLineWidth = Math.max(maxLineWidth, getLineWidth(str, font));

      if (shouldTemporarilyAttach) {
        ctx.canvas.remove();
      }
    }
  }

  const offsetX =
    model.textAlign === TextAlign.Center
      ? (w - maxLineWidth) / 2
      : model.textAlign === TextAlign.Left
        ? horOffset
        : horOffset - maxLineWidth;
  const offsetY = vertOffset - lineHeight + verticalPadding / 2;

  const bound = new Bound(
    x + offsetX,
    y + offsetY,
    maxLineWidth,
    lineHeight * lines.length
  ) as IBound;

  bound.rotate = model.rotate ?? 0;
  model.textBound = bound;
}
