import type {
  GfxCommonBlockProps,
  GfxElementGeometry,
} from '@linvo/std/gfx';
import { GfxCompatible } from '@linvo/std/gfx';
import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@linvo/store';
import { z } from 'zod';

import {
  FontFamily,
  FontFamilySchema,
  FontStyle,
  FontStyleSchema,
  FontWeight,
  FontWeightSchema,
  TextAlign,
  TextAlignSchema,
  type TextStyleProps,
} from '../../consts/index';
import { ColorSchema } from '../../themes/color';
import { DefaultTheme } from '../../themes/default';

type EdgelessTextProps = {
  hasMaxWidth: boolean;
  comments?: Record<string, boolean>;
} & Omit<TextStyleProps, 'fontSize'> &
  GfxCommonBlockProps;

export const EdgelessTextZodSchema = z
  .object({
    color: ColorSchema,
    fontFamily: FontFamilySchema,
    fontStyle: FontStyleSchema,
    fontWeight: FontWeightSchema,
    textAlign: TextAlignSchema,
  })
  .default({
    color: DefaultTheme.textColor,
    fontFamily: FontFamily.Inter,
    fontStyle: FontStyle.Normal,
    fontWeight: FontWeight.Regular,
    textAlign: TextAlign.Left,
  });

export const EdgelessTextBlockSchema = defineBlockSchema({
  flavour: 'linvo:edgeless-text',
  props: (): EdgelessTextProps => ({
    xywh: '[0,0,16,16]',
    index: 'a0',
    lockedBySelf: false,
    scale: 1,
    rotate: 0,
    hasMaxWidth: false,
    comments: undefined,
    ...EdgelessTextZodSchema.parse(undefined),
  }),
  metadata: {
    version: 1,
    role: 'hub',
    parent: ['linvo:surface'],
    children: [
      'linvo:paragraph',
      'linvo:list',
      'linvo:code',
      'linvo:image',
      'linvo:bookmark',
      'linvo:attachment',
      'linvo:embed-!(synced-doc)',
      'linvo:latex',
    ],
  },
  toModel: () => new EdgelessTextBlockModel(),
});

export const EdgelessTextBlockSchemaExtension = BlockSchemaExtension(
  EdgelessTextBlockSchema
);

export class EdgelessTextBlockModel
  extends GfxCompatible<EdgelessTextProps>(BlockModel)
  implements GfxElementGeometry
{
  get color() {
    return this.props.color;
  }

  set color(color: EdgelessTextProps['color']) {
    this.props.color = color;
  }
}
