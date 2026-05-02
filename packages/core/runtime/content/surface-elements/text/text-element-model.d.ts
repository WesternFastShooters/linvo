import type { IVec, SerializedXYWH } from '@linvo-core/global/gfx';
import { Bound } from '@linvo-core/global/gfx';
import type { BaseElementProps } from '@linvo-core/std/gfx';
import { GfxPrimitiveElementModel } from '@linvo-core/std/gfx';
import { PlainText } from '@linvo-core/store/reactive/text';
import { FontFamily, FontStyle, FontWeight, TextAlign, type TextStyleProps } from '../../definitions';
import { type Color } from '../../theme';
export type TextElementProps = BaseElementProps & {
    text: PlainText;
    hasMaxWidth?: boolean;
} & Omit<TextStyleProps, 'fontWeight' | 'fontStyle'> & Partial<Pick<TextStyleProps, 'fontWeight' | 'fontStyle'>>;
export declare class TextElementModel extends GfxPrimitiveElementModel<TextElementProps> {
    get type(): string;
    static propsToY(props: Record<string, unknown>): Record<string, unknown>;
    containsBound(bounds: Bound): boolean;
    getLineIntersections(start: IVec, end: IVec): import("@linvo-core/global/gfx").PointLocation[] | null;
    getNearestPoint(point: IVec): IVec;
    includesPoint(x: number, y: number): boolean;
    accessor color: Color;
    accessor fontFamily: FontFamily;
    accessor fontSize: number;
    accessor fontStyle: FontStyle;
    accessor fontWeight: FontWeight;
    accessor hasMaxWidth: boolean;
    accessor rotate: number;
    accessor text: PlainText;
    accessor textAlign: TextAlign;
    accessor xywh: SerializedXYWH;
}
