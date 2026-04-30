import {
  ColorSchema,
  ConnectorMode,
  DEFAULT_CONNECTOR_MODE,
  DEFAULT_FRONT_ENDPOINT_STYLE,
  DEFAULT_HIGHLIGHTER_LINE_WIDTH,
  DEFAULT_REAR_ENDPOINT_STYLE,
  DEFAULT_ROUGHNESS,
  DefaultTheme,
  EdgelessTextZodSchema,
  FontFamily,
  FontFamilySchema,
  FontStyle,
  FontStyleSchema,
  FontWeight,
  FontWeightSchema,
  FrameZodSchema,
  HIGHLIGHTER_LINE_WIDTHS,
  LayoutType,
  LineWidth,
  MindmapStyle,
  NoteZodSchema,
  PointStyle,
  ShapeStyle,
  StrokeStyle,
  StrokeStyleSchema,
  TextAlign,
  TextAlignSchema,
  TextVerticalAlign,
} from '@linvo/linvo-model';
import {
  z,
  ZodDefault,
  ZodIntersection,
  ZodObject,
  type ZodTypeAny,
  ZodUnion,
} from 'zod';

const ConnectorEndpointSchema = z.nativeEnum(PointStyle);
const LineWidthSchema = z.nativeEnum(LineWidth);
const ShapeStyleSchema = z.nativeEnum(ShapeStyle);
const TextVerticalAlignSchema = z.nativeEnum(TextVerticalAlign);
const ConnectorModeSchema = z.nativeEnum(ConnectorMode);
const LayoutTypeSchema = z.nativeEnum(LayoutType);
const MindmapStyleSchema = z.nativeEnum(MindmapStyle);

export const ConnectorSchema = z
  .object({
    frontEndpointStyle: ConnectorEndpointSchema,
    rearEndpointStyle: ConnectorEndpointSchema,
    stroke: ColorSchema,
    strokeStyle: StrokeStyleSchema,
    strokeWidth: LineWidthSchema,
    rough: z.boolean(),
    mode: ConnectorModeSchema,
    labelStyle: z.object({
      color: ColorSchema,
      fontSize: z.number(),
      fontFamily: FontFamilySchema,
      fontWeight: FontWeightSchema,
      fontStyle: FontStyleSchema,
      textAlign: TextAlignSchema,
    }),
  })
  .default({
    frontEndpointStyle: DEFAULT_FRONT_ENDPOINT_STYLE,
    rearEndpointStyle: DEFAULT_REAR_ENDPOINT_STYLE,
    stroke: DefaultTheme.connectorColor,
    strokeStyle: StrokeStyle.Solid,
    strokeWidth: LineWidth.Two,
    rough: false,
    mode: DEFAULT_CONNECTOR_MODE,
    labelStyle: {
      color: DefaultTheme.black,
      fontSize: 16,
      fontFamily: FontFamily.Inter,
      fontWeight: FontWeight.Regular,
      fontStyle: FontStyle.Normal,
      textAlign: TextAlign.Center,
    },
  });

export const BrushSchema = z
  .object({
    color: ColorSchema,
    lineWidth: LineWidthSchema,
  })
  .default({
    color: DefaultTheme.black,
    lineWidth: LineWidth.Four,
  });

export const HighlighterSchema = z
  .object({
    color: ColorSchema,
    lineWidth: z
      .number()
      .int()
      .refine(value => HIGHLIGHTER_LINE_WIDTHS.includes(value)),
  })
  .default({
    color: DefaultTheme.hightlighterColor,
    lineWidth: DEFAULT_HIGHLIGHTER_LINE_WIDTH,
  });

const DEFAULT_SHAPE = {
  color: DefaultTheme.shapeTextColor,
  fillColor: DefaultTheme.shapeFillColor,
  strokeColor: DefaultTheme.shapeStrokeColor,
  strokeStyle: StrokeStyle.Solid,
  strokeWidth: LineWidth.Two,
  shapeStyle: ShapeStyle.General,
  filled: true,
  radius: 0,
  fontSize: 20,
  fontFamily: FontFamily.Inter,
  fontWeight: FontWeight.Regular,
  fontStyle: FontStyle.Normal,
  textAlign: TextAlign.Center,
  roughness: DEFAULT_ROUGHNESS,
};

const ShapeObject = {
  color: ColorSchema,
  fillColor: ColorSchema,
  strokeColor: ColorSchema,
  strokeStyle: StrokeStyleSchema,
  strokeWidth: z.number(),
  shapeStyle: ShapeStyleSchema,
  filled: z.boolean(),
  radius: z.number(),
  fontSize: z.number(),
  fontFamily: FontFamilySchema,
  fontWeight: FontWeightSchema,
  fontStyle: FontStyleSchema,
  textAlign: TextAlignSchema,
  textHorizontalAlign: TextAlignSchema.optional(),
  textVerticalAlign: TextVerticalAlignSchema.optional(),
  roughness: z.number(),
};

export const ShapeSchema = z.object(ShapeObject).default(DEFAULT_SHAPE);

export const RoundedShapeSchema = z
  .object(ShapeObject)
  .default({ ...DEFAULT_SHAPE, radius: 0.1 });

export const TextSchema = z
  .object({
    color: ColorSchema,
    fontSize: z.number(),
    fontFamily: FontFamilySchema,
    fontWeight: FontWeightSchema,
    fontStyle: FontStyleSchema,
    textAlign: TextAlignSchema,
  })
  .default({
    color: DefaultTheme.textColor,
    fontSize: 24,
    fontFamily: FontFamily.Inter,
    fontWeight: FontWeight.Regular,
    fontStyle: FontStyle.Normal,
    textAlign: TextAlign.Left,
  });

export const MindmapSchema = z
  .object({
    layoutType: LayoutTypeSchema,
    style: MindmapStyleSchema,
  })
  .default({
    layoutType: LayoutType.RIGHT,
    style: MindmapStyle.ONE,
  });

export const NodePropsSchema = z.object({
  connector: ConnectorSchema,
  brush: BrushSchema,
  highlighter: HighlighterSchema,
  text: TextSchema,
  mindmap: MindmapSchema,
  'linvo:edgeless-text': EdgelessTextZodSchema,
  'linvo:note': NoteZodSchema,
  'linvo:frame': FrameZodSchema,
  // shapes
  'shape:diamond': ShapeSchema,
  'shape:ellipse': ShapeSchema,
  'shape:rect': ShapeSchema,
  'shape:triangle': ShapeSchema,
  'shape:hexagon': ShapeSchema,
  'shape:pentagon': ShapeSchema,
  'shape:octagon': ShapeSchema,
  'shape:parallelogram': ShapeSchema,
  'shape:leanLeft': ShapeSchema,
  'shape:trapezoid': ShapeSchema,
  'shape:trapezoidAlt': ShapeSchema,
  'shape:stadium': ShapeSchema,
  'shape:subroutine': ShapeSchema,
  'shape:cylinder': ShapeSchema,
  'shape:horizontalCylinder': ShapeSchema,
  'shape:linedCylinder': ShapeSchema,
  'shape:document': ShapeSchema,
  'shape:linedDocument': ShapeSchema,
  'shape:multiDocument': ShapeSchema,
  'shape:note': ShapeSchema,
  'shape:package': ShapeSchema,
  'shape:cloud': ShapeSchema,
  'shape:doubleCircle': ShapeSchema,
  'shape:filledCircle': ShapeSchema,
  'shape:asymmetric': ShapeSchema,
  'shape:hourglass': ShapeSchema,
  'shape:notchedRect': ShapeSchema,
  'shape:notchedPentagon': ShapeSchema,
  'shape:bolt': ShapeSchema,
  'shape:bang': ShapeSchema,
  'shape:flag': ShapeSchema,
  'shape:bowRect': ShapeSchema,
  'shape:smallCircle': ShapeSchema,
  'shape:framedCircle': ShapeSchema,
  'shape:crossedCircle': ShapeSchema,
  'shape:taggedDocument': ShapeSchema,
  'shape:taggedRect': ShapeSchema,
  'shape:braceLeft': ShapeSchema,
  'shape:braceRight': ShapeSchema,
  'shape:braces': ShapeSchema,
  'shape:delay': ShapeSchema,
  'shape:curvedTrapezoid': ShapeSchema,
  'shape:dividedRect': ShapeSchema,
  'shape:forkJoin': ShapeSchema,
  'shape:windowPane': ShapeSchema,
  'shape:linedRect': ShapeSchema,
  'shape:flippedTriangle': ShapeSchema,
  'shape:slopedRect': ShapeSchema,
  'shape:stackedRect': ShapeSchema,
  'shape:odd': ShapeSchema,
  'shape:roundedRect': RoundedShapeSchema,
});

export type NodeProps = z.infer<typeof NodePropsSchema>;

export function makeDeepOptional(schema: ZodTypeAny): ZodTypeAny {
  if (schema instanceof ZodDefault) {
    return makeDeepOptional(schema._def.innerType);
  }
  if (schema instanceof ZodObject) {
    const shape = schema.shape;
    const deepOptionalShape = Object.fromEntries(
      Object.entries(shape).map(([key, value]) => {
        return [key, makeDeepOptional(value as ZodTypeAny)];
      })
    );
    return z.object(deepOptionalShape).optional();
  } else if (schema instanceof ZodUnion) {
    return schema.or(z.undefined());
  } else if (schema instanceof ZodIntersection) {
    return z.intersection(
      makeDeepOptional(schema._def.left),
      makeDeepOptional(schema._def.right)
    );
  } else {
    return schema.optional();
  }
}
