import type { IVec, SerializedXYWH } from '@linvo-core/global/gfx';
import {
  Bound,
  getPointsFromBoundWithRotation,
  linePolygonIntersects,
  pointInPolygon,
  polygonNearestPoint,
} from '@linvo-core/global/gfx';
import type { BaseElementProps } from '@linvo-core/std/gfx';
import { field, GfxPrimitiveElementModel } from '@linvo-core/std/gfx';
import { PlainText } from '@linvo-core/store/reactive/text';

import {
  FontFamily,
  FontStyle,
  FontWeight,
  TextAlign,
  type TextStyleProps,
} from '../../definitions';
import { type Color, DefaultTheme } from '../../theme';

export type TextElementProps = BaseElementProps & {
  text: PlainText;
  hasMaxWidth?: boolean;
} & Omit<TextStyleProps, 'fontWeight' | 'fontStyle'> &
  Partial<Pick<TextStyleProps, 'fontWeight' | 'fontStyle'>>;

export class TextElementModel extends GfxPrimitiveElementModel<TextElementProps> {
  get type() {
    return 'text';
  }

  static propsToY(props: Record<string, unknown>) {
    if (typeof props.text === 'string') {
      props.text = new PlainText(props.text);
    }

    return props;
  }

  override containsBound(bounds: Bound): boolean {
    const points = getPointsFromBoundWithRotation(this);
    return points.some(point => bounds.containsPoint(point));
  }

  override getLineIntersections(start: IVec, end: IVec) {
    const points = getPointsFromBoundWithRotation(this);
    return linePolygonIntersects(start, end, points);
  }

  override getNearestPoint(point: IVec): IVec {
    return polygonNearestPoint(
      Bound.deserialize(this.xywh).points,
      point
    ) as IVec;
  }

  override includesPoint(x: number, y: number): boolean {
    const points = getPointsFromBoundWithRotation(this);
    return pointInPolygon([x, y], points);
  }

  @field()
  accessor color: Color = DefaultTheme.black;

  @field()
  accessor fontFamily: FontFamily = FontFamily.Inter;

  @field()
  accessor fontSize: number = 16;

  @field(FontStyle.Normal as FontStyle)
  accessor fontStyle: FontStyle = FontStyle.Normal;

  @field(FontWeight.Regular as FontWeight)
  accessor fontWeight: FontWeight = FontWeight.Regular;

  @field(false)
  accessor hasMaxWidth: boolean = false;

  @field(0)
  accessor rotate: number = 0;

  @field()
  accessor text: PlainText = new PlainText();

  @field()
  accessor textAlign: TextAlign = TextAlign.Center;

  @field()
  accessor xywh: SerializedXYWH = '[0,0,16,16]';
}
